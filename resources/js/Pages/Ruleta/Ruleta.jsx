import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Wheel } from 'react-custom-roulette';
import MainLayout from '@/Layouts/MainLayout';

export default function Ruleta() {
  const [input, setInput] = useState('');
  const [opciones, setOpciones] = useState([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [premioIndex, setPremioIndex] = useState(0);
  const [ganador, setGanador] = useState(null);

  const manejarGirar = () => {
    if (opciones.length === 0) return;
    const indexAleatorio = Math.floor(Math.random() * opciones.length);
    setPremioIndex(indexAleatorio);
    setMustSpin(true);
  };

  const coloresDisponibles = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
    '#9966FF', '#FF9F40', '#00A878', '#FF5E5B',
    '#3D348B', '#E4B363', '#2EC4B6', '#E71D36',
    '#F4D35E', '#0081A7', '#F07167', '#70C1B3',
    '#9B5DE5', '#00BBF9', '#00F5D4', '#F15BB5',
  ];

  const opcionesRuleta = opciones.length > 0
    ? opciones
    : [{ option: '...' }, { option: '...' }];

  const backgroundColors = opcionesRuleta.map((_, i) =>
    coloresDisponibles[i % coloresDisponibles.length]
  );

  return (
    <>
      <Head title="Ruleta" />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-8 text-center">Ruleta de Opciones</h1>

        <div className="flex flex-col md:flex-row gap-32 justify-center items-start mb-8">
          <textarea
            className="w-full md:w-64 border rounded p-2 h-[500px] resize-none"
            value={input}
            onChange={(e) => {
              const valor = e.target.value;
              setInput(valor);

              const lineas = valor
                .split('\n')
                .map((linea) => linea.trim())
                .filter((linea) => linea.length > 0);

              const nuevasOpciones = lineas
                .map((linea) => ({ option: linea }))
                .filter((op) => typeof op.option === 'string' && op.option.length > 0);

              setOpciones(nuevasOpciones);
            }}
            placeholder="Escribe una opción por línea"
          />

          <div className="flex flex-col items-center">
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={premioIndex}
              data={opcionesRuleta}
              onStopSpinning={() => {
                setMustSpin(false);
                setGanador(opciones[premioIndex]?.option ?? null);
              }}
              backgroundColors={backgroundColors}
              textColors={['#ffffff']}
              outerBorderWidth={1}
              radiusLineWidth={0}
              outerBorderColor="transparent"
              radiusLineColor="transparent"
            />

            <button
              onClick={manejarGirar}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              disabled={opciones.length < 2}
            >
              Girar
            </button>
          </div>
        </div>

        {ganador && (
          <div className="mt-6 text-xl font-semibold text-green-700 text-center">
            Opción ganadora: {ganador}
          </div>
        )}
      </div>
    </>
  );
}

Ruleta.layout = (page) => <MainLayout>{page}</MainLayout>;
