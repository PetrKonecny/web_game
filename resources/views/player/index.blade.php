@extends('master_page')
@section('content')
All players in the database:
@foreach ($players as $player)
    {{$player->Login}} </br>
@endforeach
@endsection


