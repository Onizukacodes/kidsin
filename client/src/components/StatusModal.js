import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GLOBALTYPES } from "../redux/actions/globalTypes";
import { createPost, updatePost } from "../redux/actions/post";
import { Dropdown } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import { getDataAPI } from "../utils/fetchData";

const StatusModal = () => {
  const a=useParams()
  const { auth, status, socket,pageId } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [stream, setStream] = useState(false);
  const [studentPost, setstudentPost] = useState([]);

  const videoRef = useRef();
  const refCanvas = useRef();
  const [tracks, setTracks] = useState("");

  useEffect(() => {
    if (status.onEdit) {
      console.log(status,"this is statu")
      setContent(status.content);
      setImages(status.images);
    }
  }, [status]);

  const handleChangeImages = (e) => {
    const files = [...e.target.files];
    let err = "";
    let newImages = [];
    files.forEach((file) => {
      if (!file) return (err = "file does not exist");
      if (file.size >1024*1024*50) {
        return (err = "Select upto 50 mb");
      }

      return newImages.push(file);
    });
    if (err) dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } });
    setImages([...images, ...newImages]);
  };

  const deleteImages = (index) => {
    const newArr = [...images];
    newArr.splice(index, 1);
    setImages(newArr);
  };

  const handleStream = () => {
    setStream(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
          const track = mediaStream.getTracks();
          setTracks(track[0]);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleCapture = () => {
    const width = videoRef.current.clientWidth;
    const height = videoRef.current.clientHeight;
    refCanvas.current.setAttribute("width", width);
    refCanvas.current.setAttribute("height", height);
    const ctx = refCanvas.current.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, width, height);
    let URL = refCanvas.current.toDataURL();
    setImages([...images, { camera: URL }]);
  };

  const handleStopStream = () => {
    tracks.stop();
    setStream(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // if(images.length===0)
    // return dispatch({type:GLOBALTYPES.ALERT,payload:{error:"Please add an image"}})
    if (status.onEdit) {
      console.log(content)
      dispatch(updatePost({ content, images, auth, status }));
    } else {
      dispatch(createPost({ content, images, auth, socket }));
    }
    setContent("");
    setImages([]);
    if (tracks) tracks.stop();
    dispatch({ type: GLOBALTYPES.STATUS, payload: false });
  };

  const imageShow=(src)=>{
    return(
      <img src={src} alt="images" className="img-thumbnail"/>
    )
  }


  const videoShow=(src)=>{
    return(
      <video controls src={src} alt="images" className="img-thumbnail"/>
    )
  }


  const getstudentpost=async()=>{
    const post=await getDataAPI('studentpostpre',auth.token)
    let studentPosts=[] 
    for(let i of post.data)
    {
      studentPosts.push({
        key: i._id,
        value: i.text,
        text: i.text,
        any: i._id,
      })
    }
     
  
    setstudentPost(studentPosts)
  }

  useEffect(() => {
    getstudentpost()
    return () => {
      console.log("cleanup")
    };
  }, [])


  const StudentDropdown=()=>{
    const { auth,socket } = useSelector((state) => state);
    const [content, setContent] = useState('')
    const dispatch=useDispatch()
  
    const handleOnchange = (e, data) => {
      console.log(data)
      setContent(data.value);
    };
    
;

  
    const handleSubmitstudent = (e) => {
      e.preventDefault();
      // if(images.length===0)
      // return dispatch({type:GLOBALTYPES.ALERT,payload:{error:"Please add an image"}})
      if (status.onEdit) {
        console.log(content)
        dispatch(updatePost({ content, images, auth, status }));
      } else {
        dispatch(createPost({ content, images, auth, socket }));
      }
      setContent("");
      setImages([]);
      if (tracks) tracks.stop();
      dispatch({ type: GLOBALTYPES.STATUS, payload: false });
    };
  
  
   
  
  
  
    return(
      <div className="status_modal"  onClick={ ()=>dispatch({ type: GLOBALTYPES.STATUS, payload: false })}>
      <div className="inn-ctn-box mt-4 " style={{width:'50%',height:'50%',margin:'auto'}}>
      <h2>Post</h2>
      <hr/>
      <h4>Select Post</h4>
      <Dropdown
        name="interest"
        onChange={handleOnchange}
        placeholder="Select Post"
        fluid
        search
        selection
        options={studentPost}
      />
      <button
        onClick={(e) =>{handleSubmitstudent(e);    dispatch({ type: GLOBALTYPES.STATUS, payload: false });}}
        className="followBtn"
      >
        Post
      </button>
    </div>
    </div>
  
    )
  }
  return (
  <>
    {auth.user.role==='school'?<div className="status_modal">
      <form onSubmit={handleSubmit}>
        <div className="status_header">
          <h5 className="m-0">Create Post</h5>
          <span
            onClick={() =>
              dispatch({ type: GLOBALTYPES.STATUS, payload: false })
            }
          >
            &times;
          </span>
        </div>
        <div className="status_body">
          <textarea
            name="content"
            placeholder={`${auth.user.fullname},what are you thinking`}
            onChange={(e) => setContent(e.target.value)}
            value={content}
          />

          <div className="show_images">
            {images.map((img, index) => (
              <div key={index} id="file_img">
                    {
                      img.camera?imageShow(img.camera):img.url
                      ?<>
                      {
                        img.url.match(/video/i)
                        ?videoShow(img.url):imageShow(img.url)

                      }
                      </>:
                      <>
                       {
                        img.type.match(/video/i)
                        ?videoShow(URL.createObjectURL(img)):imageShow(URL.createObjectURL(img))

                      }
                      </>
                    }
                <span onClick={() => deleteImages(index)}>&times;</span>
              </div>
            ))}
          </div>
          {stream && (
            <div className="stream position-relative">
              <video
                src=""
                autoPlay
                muted
                ref={videoRef}
                width="100%"
                height="100%"
              />
              <span onClick={handleStopStream}>&times;</span>
              <canvas ref={refCanvas} style={{ display: "none" }} />
            </div>
          )}
          <div className="input_images">
            {stream ? (
              <i className="fas fa-camera" onClick={handleCapture} />
            ) : (
              <>
                <div className="file_upload">
                  <i className="fas fa-image" />
                  <input
                    type="file"
                    name="file"
                    id="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleChangeImages}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="status_footer ">
          <button className="btn followBtn w-50">Post</button>
          <button
            onClick={() =>
              dispatch({ type: GLOBALTYPES.STATUS, payload: false })
            }
            className="btn followBtn  w-50"
          >
            cancel
          </button>
        </div>
      </form>
    </div>
  :<StudentDropdown/>  }</>
  );
};

export default StatusModal;
