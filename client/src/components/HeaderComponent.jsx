import { Link, useLocation } from "react-router-dom";
import { BotIcon } from "lucide-react";
import { motion } from "framer-motion";

const HeaderComponent = (props) => {
  const { user, logout } = props;
  const location = useLocation();

  const shouldHideButton =
    location.pathname.startsWith("/chat") ||
    location.pathname.startsWith("/result") ||
    location.pathname.startsWith("/interview")
  
    const  hideDashboard = location.pathname.startsWith("/dashboard")

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="p-2 bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl shadow-lg">
              <BotIcon className="w-6 h-6 text-white" />
            </div>
            <Link
              to="/"
              className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent"
            >
              InterviewAI
            </Link>
          </motion.div>

          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-slate-600 hover:text-slate-800 font-medium transition-all duration-300 hover:scale-105"
                >
                  {/* {user.fullname} */}
                </Link>
                <motion.button
                  onClick={() => logout()}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {" "}
                  Logout
                </motion.button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-slate-600 hover:text-slate-800 font-medium transition-all duration-300 hover:scale-105"
              >
                Sign In
              </Link>
            )}

            {!shouldHideButton ? (
              user ? (<>
              {!hideDashboard ? (

                  <Link
                    to="/dashboard"
                    className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-6 py-2.5 rounded-xl font-medium hover:from-slate-700 hover:to-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Dashboard
                  </Link>
              ): <></>}
                <Link
                  to="/interview"
                  className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-6 py-2.5 rounded-xl font-medium hover:from-slate-700 hover:to-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Start Interview
                </Link>
              </>
              ) : (
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-6 py-2.5 rounded-xl font-medium hover:from-slate-700 hover:to-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Start Interview
                </Link>
              )
            ) : (
              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-6 py-2.5 rounded-xl font-medium hover:from-slate-700 hover:to-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Dashboard
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;
