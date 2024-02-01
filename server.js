import { app } from "./app.js";
import { connectDB } from "./database/Data.js";


connectDB();

app.get("/",(req,res)=>{
  res.send("i am roshan")
})

app.listen(process.env.PORT, () => {
  console.log(`server is lisening at port ${process.env.PORT}`);
});
