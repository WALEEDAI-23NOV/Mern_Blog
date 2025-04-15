const mongoose = require('mongoose');

const dbconnect = async()=>{
    try {
        const conn = await mongoose.connect("mongodb+srv://waleedrazaq75:Waleedrazaqjattal1@merncluster.eq5z1.mongodb.net/BlogHome?retryWrites=true&w=majority&appName=MERNCluster");
        console.log(`Database is connected to ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error:${error}`);
    }
};

module.exports= dbconnect;