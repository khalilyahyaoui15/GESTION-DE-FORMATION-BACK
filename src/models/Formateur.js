import mongoose from 'mongoose'
import validator from 'validator'
import Session from './Session.js';
const formateurSchema = new mongoose.Schema(
  {
    email  : {
      type : String,
      required : true,
      unique : true,
      trim : true,
      lowercase : true,
      validate(value){
        if(!validator.isEmail(value)){
          throw new Error("invalid email !");
        }
      },
    },
    nom : {
      type : String,
      required : true,
      trim :  true,
    },
    prenom : {
      type : String,
      required : true,
      trim : true, 
    },
    tel : {
      type : Number,
      required : true,
    },
    
  },
  {
    timestamps: true,
  }
);





const Formateur = mongoose.model('Formateur', formateurSchema)

export default Formateur
