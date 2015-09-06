@extends('master_page')
@section('content')
Army from database:
    {{$army->Army_name}} </br>
Has units:
@foreach ($army->units as $unit)
 {{$unit->Name}}
@endforeach
@endsection