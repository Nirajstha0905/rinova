import LoginForm from "../../components/auth/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen bg-slate-100">
            {/* Mobile Header */}
    <div className="lg:hidden text-center px-6 pt-10">
        <div className="w-16 h-16 bg-violet-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
    Rc
  </div>
      <h1 className="text-4xl font-bold text-violet-600">
        Rinova Creation
      </h1>

      <p className="mt-3 text-gray-600 max-w-xs mx-auto">
    Streamline student recruitment,
    applications, documents and visa
    processing from one platform.
      </p>
    </div>
      <div className="grid lg:grid-cols-2 min-h-screen">
        
        {/* Desktop Left Side */}

        <div className="hidden lg:flex flex-col justify-center px-20">
          <div className="max-w-lg">
            <h1 className="text-5xl font-bold text-violet-600 mb-4">
              Rinova Creation
            </h1>

            <p className="text-xl text-gray-600 mb-12">
              Modern Education Consultancy & CRM Platform
            </p>

            <h2 className="text-3xl font-semibold mb-6">
              Key Features
            </h2>

            <ul className="space-y-4 text-lg text-gray-600">
              <li>✓ Comprehensive student management</li>
              <li>✓ Application workflow automation</li>
              <li>✓ Document verification</li>
              <li>✓ Team collaboration tools</li>
              <li>✓ Role based permissions</li>
            </ul>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="flex items-center justify-center p-6">
          <LoginForm />
        </div>

      </div>
    </div>
  );
}