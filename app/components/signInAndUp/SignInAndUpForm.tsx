import { useContextAuth } from '@/database/contexts/AuthContext';
import { SignInSchema, SignUpSchema } from '@/database/schemas/schemas';
import { SignInAndUpData } from '@/database/types/types';
import { ChangeEvent,useState } from 'react';
import * as Yup from 'yup';
import ButtonsAuthProvider from '@/app/components/signInAndUp/ButtonsAuthProvider';

export default function SignInAndUpForm() {

  const [isSignUpActive, setIsSignUpActive] = useState(false);

  const [formData, setFormData] = useState<SignInAndUpData>({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Partial<SignInAndUpData>>({});

  const handleFormChange = () => {
    setIsSignUpActive(!isSignUpActive);
    setFormData({ email: '', password: '', confirmPassword: '' });
    setErrors({});
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const { signUp, signIn } = useContextAuth();

  const handleSignUp = () => {
    SignUpSchema.validate(formData, { abortEarly: false })
      .then(() => {
        signUp(formData.email, formData.password);
      })
      .catch((validationErrors: Yup.ValidationError) => {
        const formattedErrors: Partial<SignInAndUpData> = {};
        validationErrors.inner.forEach((error) => {
          formattedErrors[error.path as keyof SignInAndUpData] = error.message;
        });
        setErrors(formattedErrors);
      });
  };

  const handleSignIn = () => {
    SignInSchema.validate(formData, { abortEarly: false })
      .then(() => {
        signIn(formData.email, formData.password);
      })
      .catch((validationErrors: Yup.ValidationError) => {
        const formattedErrors: Partial<SignInAndUpData> = {};
        validationErrors.inner.forEach((error) => {
          formattedErrors[error.path as keyof SignInAndUpData] = error.message;
        });
        setErrors(formattedErrors);
      });
  };


  return (
    <form className="w-full flex flex-col gap-2 p-10">
        <h1 className="text-center text-white text-4xl mb-3 font-black uppercase">
          {isSignUpActive ? 'Inscription' : 'Connexion'}
        </h1>
        

        <div className="mb-2 flex flex-col space-y-2">
          <label className="text-gray-300">Email</label>
          <input
            type="email"
            onChange={handleInputChange}
            value={formData.email}
            name="email"
            autoComplete="email"  
            className="border p-2 rounded-md focus:border-purple-500 text-white bg-transparent outline-none"
          />
          {errors.email && <p className="text-red-500 bg-red-100 p-2 my-2 rounded-md">{errors.email}</p>}
        </div>

        <div className="mb-2 flex flex-col space-y-2">
          <label className="text-gray-300">Mot de passe</label>
          <input
            type="password"
            onChange={handleInputChange}
            value={formData.password}
            name="password"
            autoComplete="password"  
            className="border p-2 rounded-md focus:border-purple-500 text-white bg-transparent outline-none"
          />
          {errors.password && <p className="text-red-500 bg-red-100 p-2 my-2 rounded-md">{errors.password}</p>}
        </div>

        {isSignUpActive && (
          <div className="mb-2 flex flex-col space-y-2">
            <label className="text-gray-300">Confirmer le mot de passe</label>
            <input
              type="password"
              onChange={handleInputChange}
              value={formData.confirmPassword}
              name="confirmPassword"
              autoComplete="confirmPassword"  
              className="border p-2 rounded-md focus:border-purple-500 text-white bg-transparent outline-none"
            />
            {errors.confirmPassword && <p className="text-red-500 bg-red-100 p-2 my-2 rounded-md">{errors.confirmPassword}</p>}
          </div>
        )}

        <button
          onClick={isSignUpActive ? handleSignUp : handleSignIn}
          type="button"
          className="bg-purple-800 hover:bg-purple-500 rounded-md text-white p-2"
        >
          {isSignUpActive ? "S'inscrire" : 'Se connecter'}
        </button>

        <a onClick={handleFormChange} href={isSignUpActive ? '#signUp' : '#signIn'} className="text-purple-500 hover:text-purple-900 text-right inline">
          {isSignUpActive ? 'Déjà un compte? Se connecter' : 'Pas de compte? Créer un compte'}
        </a>

        <ButtonsAuthProvider />

      </form>
  )
}
