@extends('master_page')
@section('content')
{!!Form::select('army', $armies)!!}
{!!Form::select('army', $armies)!!}
@endsection