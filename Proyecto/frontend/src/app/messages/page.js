// Esta función se ejecuta en el servidor para obtener los datos
async function getMessages() {
  // Hacemos la llamada a la URL completa de nuestro backend
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
    // Evitamos que la respuesta sea cacheada para ver los cambios al recargar
    cache: 'no-store' 
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default async function Home() {
  // Llamamos a la función y obtenemos los mensajes
  const messages = await getMessages();

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-amber-600 mb-2 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-400 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
            Mensajes de la Base de Datos
          </h1>
          <p className="text-gray-500">Visualiza los mensajes almacenados en tu backend, actualizados en tiempo real.</p>
        </div>
        <div className="grid gap-6">
          {messages.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-6 text-center text-gray-400 border border-dashed border-amber-200">
              No hay mensajes para mostrar.
            </div>
          ) : (
            messages.map(message => (
              <div key={message.id} className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4 border-l-4 border-amber-400 fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2M15 3h-6a2 2 0 00-2 2v3a2 2 0 002 2h6a2 2 0 002-2V5a2 2 0 00-2-2z" /></svg>
                <span className="text-gray-700 text-lg">{message.content}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}