import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const features = [
    {
      name: 'Track Complaints',
      description: 'Submit and track development-related complaints with ease.',
      icon: ClipboardDocumentListIcon,
    },
    {
      name: 'Knowledge Base',
      description: 'Access articles and resources to help resolve common issues.',
      icon: DocumentTextIcon,
    },
    {
      name: 'Community Support',
      description: 'Connect with other developers and share solutions.',
      icon: UserGroupIcon,
    },
    {
      name: 'Progress Monitoring',
      description: 'Monitor the status of your complaints in real-time.',
      icon: ChartBarIcon,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
              Development Complaint Tracking System
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Streamline your development process by efficiently tracking and resolving complaints.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              {isAuthenticated ? (
                <div className="rounded-md shadow">
                  <Link
                    to="/complaints"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50 md:py-4 md:text-lg md:px-10"
                  >
                    View Complaints
                  </Link>
                </div>
              ) : (
                <>
                  <div className="rounded-md shadow">
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50 md:py-4 md:text-lg md:px-10"
                    >
                      Get Started
                    </Link>
                  </div>
                  <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-500 hover:bg-green-700 md:py-4 md:text-lg md:px-10"
                    >
                      Sign In
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage development complaints
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our platform provides all the tools you need to efficiently track, manage, and resolve development-related complaints.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {features.map((feature) => (
                <div key={feature.name} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                  <p className="mt-2 ml-16 text-base text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Start tracking your complaints today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-green-200">
            Join our community of developers and start efficiently managing your development complaints.
          </p>
          {isAuthenticated ? (
            <Link
              to="/complaints/create"
              className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50 sm:w-auto"
            >
              Create a Complaint
            </Link>
          ) : (
            <Link
              to="/register"
              className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50 sm:w-auto"
            >
              Sign up for free
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
