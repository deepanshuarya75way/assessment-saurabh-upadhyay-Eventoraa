import { useState,useEffect } from "react";

const EventQRCode=({eventId,eventTitle})=>{
  const[qrCode,setQrCode]=useState(null);
  const[eventUrl,setEventUrl]=useState("");
  const[loading,setloading]=useState(true);
  const[error,setError]=useState('');

  useEffect(()=>{
    const fetchQRCode=async () => {
      try{
        setloading(true);
        const token=localStorage.getItem('token');
        const res=await fetch(`http://localhost:5000/api/events/${eventId}/qrCode`,{
          header:{
            'Authorization':`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });
        const data=await res.json();
        if(!res.ok){
          throw new Error(data.message||'Unauthorized or failed to fetch QR Code');
        }
        setQrCode(data.qrCode);
        setEventUrl(data.eventUrl);

      }catch(err){
        setError(err.message);
      }finally{
        setloading(false);
      }

      
    };
    if(eventId){
      fetchQRCode();
    }
  },[eventId]);

  const handleDownload=()=>{
    if(!qrCode)return;
    const link=document.createElement('a');
    link.href=qrCode;
    link.download=`${eventTitle||'event'}-qrcode.png`;
    document.body.appendChild(link);
    link.click();
  document.body.removeChild(link);  };

  if(loading)return <div className="p-4 text-center">Generating QR code...</div>;
  if(error)return <div className="p-4 text-red-500 font-medium">{error}</div>;

  return(
    <div className="flex flex-col items-center bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-sm mx-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Event Check-In QR Code</h3>
      <p className="text-sm text-sm text-gray-500 mb-4 text-center"> Scan using mobile camera to open event details</p>
      {qrCode && (
        <span className="text-xs text-gray-400 mt-3 break-all text-center ">{eventUrl}</span>
      )}
      <button onclick={handleDownload}
      className='mt-4 w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 shadow-sm'
      >
        Download QR Code
        </button>
      </div>
  );
    
      
 
};
export default EventQRCode;