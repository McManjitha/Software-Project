import logo from './logo.svg';
import './App.css';
import {useState,useEffect} from 'react'
import axios from 'axios'

function App() {
  
  const [url, setUrl] = useState('');
  const [image, setImage] = useState([]);
  const handleImage = (e) =>{
    const file = e.target.files[0];
    setFileToBase(file);
    // console.log(file);
}

  const setFileToBase = (file) =>{
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () =>{
        setImage(reader.result);
        console.log('image ',reader.result)
    }

}

const uploadImage = ()=>{
  // if(image){
    axios.post('http://localhost:5000/image/addImage',{image}).then((res)=>{
    if(res.data.url){
      setUrl(res.data.url);
      // console.log(res.data)
    }
  })
  // }
  
}


  const handleClick =()=>{
    axios.get('http://localhost:5000/image/').then((res)=>{
      if(res.data[0].url){
        setUrl(res.data[0].url);
        // console.log(res.data)
      }
    })
  }

  // useEffect(() => {
  //   axios.get('http://localhost:5000/image/').then((res)=>{
  //     if(res.data[0].url){
  //       setUrl(res.data[0].url);
  //     }
  //   })
  // }, [])
  

  return (
    <div  >
      <div className='imagpare'>
      <img src={
        url?url:
        image} className='image'/>
      </div>
       <div className='btnpare'>
          <button onClick={handleClick} className='btn'>Get Image</button>
       </div>
       <div className='btnpare'>
       <input onChange={(e)=>handleImage(e)}  type="file" id="formupload" name="image"/>
       </div>
      <div className='btnpare'>
      <button onClick={uploadImage} className='btn'>upload Image</button>
      </div>
      
      
    </div>
  );
}

export default App;
