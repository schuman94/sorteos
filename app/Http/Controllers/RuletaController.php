<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRuletaRequest;
use App\Http\Requests\UpdateRuletaRequest;
use App\Models\Ruleta;
use Inertia\Inertia;

class RuletaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Ruleta/Ruleta');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRuletaRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Ruleta $ruleta)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ruleta $ruleta)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRuletaRequest $request, Ruleta $ruleta)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ruleta $ruleta)
    {
        //
    }
}
