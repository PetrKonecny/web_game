<?php

namespace App\Commands;

use Log;
use App\Commands\Command;
use Illuminate\Contracts\Bus\SelfHandling;

class ResolveBattle extends Command implements SelfHandling {

    private $report = array();
    private $turnReport;
    private $subject;
    private $target;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct($subject, $target) {
        $this->subject = $subject;
        $this->target = $target;
    }

    /**
     * Execute the command.
     *
     * @return void
     */
    public function handle() {
        $subjectBefore =  unserialize(serialize($this->subject));
        $targetBefore = unserialize(serialize($this->target));
        $this->attackArmy($this->subject, $this->target);
        return response()->json([
            'targetBefore' => $targetBefore,
            'subjectBefore' => $subjectBefore,
            'target' => $this->target, 
            'subject' => $this->subject, 
            'report' => ['turns' => $this->report]]);
    }

    public function attackArmy($army, $army2) {
        Log::info('Attack army called', ['id' => $army->Id, 'id2' => $army2->Id]);
        $i = 0;
        while ($this->getMostCount($army2) !== null && $this->getMostCount($army) !== null) {
            $i++;
            $armyBeforeAttack = unserialize(serialize($army2));
            $this->turn($army, $army2);
            $this->turn($armyBeforeAttack, $army);
            if ($i > 20) {
                break;
            }
        }
    }

    public function turn($army, $army2) {
        Log::info('Turn called', ['id' => $army->Id, 'id2' => $army2->Id]);
        $units = $army->units;
        $this->turnReport = array();
        foreach ($units as $unit) {
            if($unit->pivot->Unit_count <= 0){
                Log::info('Unit is dead, not attacking');
                continue;
            }
            Log::info('Unit is attacking', ['unit' => $unit]);
            $count = ceil($unit->pivot->Unit_count);
            $j = 0;
            while ($count > 0 && $j < 10) {
                $j++;
                $target = $this->getTarget($unit->Pref_target, $army2);
                $numberOfAttackers = $this->attackUnit($unit, $target, $count);
                $count = $count - $numberOfAttackers;
                if ($numberOfAttackers < 1) {
                    break;
                }
            }
        }
        array_push($this->report, ['lines' => $this->turnReport,'attackerName'=>$army->Army_name]);
    }

    /* Returns preffered target if there is one, if there isn't returns target with most 
     * count, if there is no target with count > 0 returns null
     */

    public function getTarget($prefTarget, $army) {
        foreach ($army->units as $unit) {
            if (($unit->Name === $prefTarget) && ($unit->pivot->Unit_count > 0)) {
                Log::info('Returning pref taget', ['target' => $unit->Name]);
                return $unit;
            }
        }
        $unit = $this->getMostCount($army);
        return $unit;
    }

    /* Returns null if there is no unit with count greater than 0, otherwise returns
     * unit with the highest count */

    public function getMostCount($army) {
        $mostCount = 0;
        $result = null;
        foreach ($army->units as $unit) {
            $count = $unit->pivot->Unit_count;
            if ($count >= $mostCount && $count > 0) {
                $mostCount = $count;
                $result = $unit;
            }
        }
        Log::info('Returning most count target', ['target' => $result]);
        return $result;
    }

    public function attackUnit($unit, $target, $count) {
        if ($target == null) {
            Log::info('Nothing left to attack');
            return 0;
        }
        $targetCountBfr = $target->pivot->Unit_count;
        Log::info('Attacking unit', ['attacker' => $unit, 'target' => $target, 'count' => $count]);
        $dmg = $unit->Dmg;
        if ($unit->Pref_target == $target->Name) {
            $dmg = $dmg * 2;
        }

        $targetTotalHp = $target->Hp * $target->pivot->Unit_count;
        $attackerTotalDmg = $dmg * $count;
        Log::info('Total damage calculated', ['total damage' => $attackerTotalDmg, 'unit dmg adjusted' => $dmg]);
        $targetRemainCount = round(($targetTotalHp - $attackerTotalDmg) / $target->Hp, 2);
        Log::info('Number of units after attack', ['number' => $targetRemainCount]);
        if ($targetRemainCount > 0) {
            $numberOfAttackers = $count;
        } else {
            $numberOfAttackers = round($targetTotalHp / $dmg, 2);
            $targetRemainCount = 0;
        }

        $target->pivot->Unit_count = $targetRemainCount;
        Log::info('Returning this result', ['Total number of attackers' => $numberOfAttackers]);
        array_push($this->turnReport, [
        'subject' => $unit->Name,
        'target' => $target->Name,
        'dmg' => $attackerTotalDmg,
        'subjectCount' => $count,
        'attacked' => $numberOfAttackers,
        'targetCountBefore' => $targetCountBfr,
        'targetCountAfter' => $targetRemainCount
        ]);
        return $numberOfAttackers;
    }

}