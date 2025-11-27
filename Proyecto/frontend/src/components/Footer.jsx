import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-amber-500 p-2 rounded-lg">
                <i data-feather="zap" className="text-white" />
              </div>
              <h3 className="text-xl font-bold">Prestamo<span className="text-amber-500">CL</span></h3>
            </div>
            <p className="text-gray-400 mb-4">La forma más rápida y sencilla de obtener dinero cuando lo necesites.</p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Enlaces útiles</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white">Inicio</Link></li>
              <li><Link href="/como_funciona" className="text-gray-400 hover:text-white">Cómo funciona</Link></li>
              <li><Link href="/beneficios" className="text-gray-400 hover:text-white">Beneficios</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Términos y condiciones</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Política de privacidad</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Contacto</h4>
            <ul className="space-y-2">
              <li className="flex items-center"><i data-feather="mail" className="text-gray-400 mr-2" /> hola@PrestamoCL.cl</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© 2025 PrestamoCL. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
