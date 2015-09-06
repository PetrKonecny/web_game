@extends('master_page')
@section('content')
All armies in the database:
@foreach ($armies as $army)
    {{$army->Army_name}} </br>
@endforeach
@endsection


