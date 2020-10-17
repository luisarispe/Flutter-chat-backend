const monngose =require('mongoose');

const dbConnection = async()=>{
    try {
        await monngose.connect(process.env.DB_CNN, {
            useNewUrlParser:true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });



        console.log('db online');
    } catch (error) {
        console.log(error);
        throw new Error("Error en la base de datosss");
    }
}

module .exports={
    dbConnection
}