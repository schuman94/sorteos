<x-mail::message>
# 🎉 ¡Enhorabuena, has ganado un premio! 🎉

Has conseguido un premio de la colección **{{ $rasca->coleccion->nombre }}**.

**Premio:** {{ $premio->nombre }}

@if($premio->descripcion)
**Descripción:**
{{ $premio->descripcion }}
@endif

@if($premio->proveedor)
**Proveedor:** {{ $premio->proveedor }}
@endif

@if($premio->link)
<x-mail::button :url="$premio->link">
    Ver más detalles del premio
</x-mail::button>
@endif

---

**Código del rasca:**
`{{ $rasca->codigo }}`

---

Gracias por participar en esta colección de rascas,

**{{ config('app.name') }}**
</x-mail::message>
