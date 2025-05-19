@php
    use Carbon\Carbon;
    $fechaRascado = Carbon::parse($rasca->scratched_at)
        ->locale('es')
        ->timezone('Europe/Madrid')
        ->isoFormat('D [de] MMMM [de] YYYY [a las] HH:mm');
@endphp

<x-mail::message>
# 📨 ¡Un usuario ha ganado un premio en tu colección! 📨

El usuario **{{ $usuario->name }}** ha conseguido un premio
de tu colección **{{ $rasca->coleccion->nombre ?? 'Colección desconocida' }}** el día **{{ $fechaRascado }}**.

---

**Código del rasca:**
`{{ $rasca->codigo }}`

**Email del usuario:** {{ $usuario->email }}

---

**Premio:** {{ $premio->nombre }}

@if($premio->descripcion)
**Descripción:**
{{ $premio->descripcion }}
@endif

@if($premio->proveedor)
**Proveedor:** {{ $premio->proveedor }}
@endif

@if($premio->link)
<x-mail::button :url="route('premios.show', $premio->id)">
Ver información del premio
</x-mail::button>
@endif

---

Gracias por confiar en nosotros,

**{{ config('app.name') }}**
</x-mail::message>
