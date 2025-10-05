import mongoose from "mongoose";
import '../envConfig'

export default async function connect(){
    try {
        mongoose.connect(process.env.MONGODB_URI as string);
        const connection = mongoose.connection;
        connection.on('connected',()=>{
            console.log(`MongoDB connected at port: ${connection.port}`)
        })

        connection.on('error', (err) => {
        console.log('Mongodb connection error. Please make sure Mongodb is running', + err);
        process.exit();
        })

    } catch (error) {
        console.log('error in db config', error);
    }
}