import { Environment ,OrbitControls } from "@react-three/drei";
import { Avatar } from "./Avatar";

export const Experience = (props) => {
  // let [audioUrl, setAudioUrl] = useState('');
  // let [jsonObjects, setJsonObjects] = useState([]);
  // // let audioUrl = props.audio
  
  // setAudioUrl(props.audioUrl)
  // setJsonObjects(props.jsonObjects)
  console.log("audio urlll exp: ", props.audioUrl)
  console.log("jsonobjects exp: ", props.jsonObjects)
  return (
    <>
      <OrbitControls />
      {/* <mesh>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh> */}
      <Avatar position={[0, -3, 5]} scale={2} audioUrl={props.audioUrl} jsonObjects={props.jsonObjects}/>
      <Environment preset="sunset"></Environment>
    </>
  );
};
