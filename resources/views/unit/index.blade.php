@extends('master_page')
@section('content')
All units in the database:
@foreach ($units as $unit)
    {{$unit->Name}} </br>
@endforeach
@endsection


