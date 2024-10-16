import * as Yup from 'yup';

export const SignInSchema = Yup.object().shape({
  email: Yup.string().email("Le format de votre adresse e-mail n'est pâs valide").required("L'adresse e-mail est requise"),
  password: Yup.string().required('Le mot de passe est requis').min(6, 'Le mot de passe doit contenir au moins 6 caractères')
});

export const SignUpSchema = Yup.object().shape({
  email: Yup.string().email("Le format de l-email n'est pas valide").required("L'email est requis"),
  password: Yup.string().min(6, 'Le mot de passe doit comporter au moins 6 caractères').required('Le mot de passe requis'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Les mots de passe ne correspondent pas')
    .required('Confirmation du mot de passe requise'),
});

export const UpdateUserSchema = Yup.object().shape({
  firstName: Yup.string(),
  lastName: Yup.string(),
  job: Yup.string(),
  websiteUrl: Yup.string(),
  youtubeUrl: Yup.string(),
  githubUrl: Yup.string(),
  instagramUrl: Yup.string(),
  description: Yup.string(),
  image: Yup.string(),
  background: Yup.string(),
  langages: Yup.array().of(Yup.string()).optional(), 
});


export const PostsSchema = Yup.object().shape({
  title: Yup.string()
    .required('Le titre est requis')
    .min(5, 'Le titre doit contenir au moins 5 caractères'),
  
  description: Yup.string()
    .required('La description est requise')
    .min(20, 'La description doit contenir au moins 20 caractères'),
  
  category: Yup.string()
    .required('La catégorie est requise'),
  
  postUrl: Yup.string()
    .url('L\'URL doit être valide')
    .nullable(), // Permet de laisser ce champ vide s'il n'est pas requis
  
  image: Yup.string()
   

});