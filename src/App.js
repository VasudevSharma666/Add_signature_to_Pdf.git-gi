import React, { useState, useRef } from 'react'
import './App.css';
import PDF from '@mikecousins/react-pdf';
import submit from './submit'
import SignatureCanvas from 'react-signature-canvas'
import { Rnd } from "react-rnd";
import { isEmpty } from 'lodash';

const styles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "dashed 2px black",
};

function App() {
  const [numPage, setnumPage] = useState(0)
  const [Pdf, setPdf] = useState(null)
  const [signer, setSigner] = useState(null)
  const [page, setPage] = useState(1);
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  })
  const [size, setSize] = useState({
    width: 200,
    height: 200,
  })
  const [colorPad, setColorPad] = useState('black')
  const [fileName, setFileName] = useState("")
  const canvesRef = useRef();

  const setFile = (file) => {
    let readFile = new FileReader()
    readFile.readAsDataURL(file)
    readFile.onloadend = (e) => {
      setPdf(e.target.result)
    }
  }
  // const setNewPdf = async (promise) => {
  //   const result = await promise;
  //   const base64 = Buffer.from(result).toString('base64');
  //   setPdf(`data:application/pdf;base64,${base64}`)
  // }

  return (
    <div className="App">
      {Pdf ? <>
        <h4>show the PDF  & place the signature </h4>
        <div className="pdf-View" >
          <Rnd
            size={{ width: size.width, height: size.height }}
            position={{ x: position.x, y: position.y }}
            minWidth={100}
            minHeight={100}
            onResize={(e, direction, ref, delta) => {
              setSize({
                width: ref.style.width,
                height: ref.style.height
              })
            }}
            onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
            style={styles}
          >
            <img src={signer} alt="signer" style={{ width: size.width, height: size.height }} />
          </Rnd>
          <PDF
            file={Pdf}
            page={page}
            scale={1.0}
            className="pdfView"
            cMapPacked={true}
            onDocumentLoadSuccess={e => setnumPage(e._pdfInfo.numPages)}
          />
          <div>
            <button onClick={() => setPage(page - 1)} disabled={page <= 1} >Pre-Page</button>
            <button onClick={() => setPage(page + 1)} disabled={page >= numPage} >Next-Page</button>
            {/* <button onClick={() => setNewPdf(submit(Pdf, signer, page, position, size))}>submit</button> */}
          </div>
          <hr />
          <div>
            <input type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="Enter Filename" />
            <button onClick={() => submit(Pdf, signer, page, position, size, fileName)} disabled={isEmpty(fileName)}>Download</button>
          </div>
        </div>
      </> :
        <div className="pdf-View" >
          <h2>Enter your signature</h2>
          <SignatureCanvas penColor={colorPad}
            ref={canvesRef}
            canvasProps={{ width: 300, height: 200, className: 'sigCanvas' }} />
          <div>
            <select value={colorPad} onChange={(e) => {
              canvesRef.current.clear()
              setColorPad(e.target.value)
            }}>
              <option value="black">Black</option>
              <option value="Blue">Blue</option>
              <option value="red">Red</option>
            </select>
            <button onClick={() => setSigner(canvesRef.current.toDataURL())} >save</button>
            <button onClick={() => {
              canvesRef.current.clear()
              setSigner(null)
            }} >Clear</button>
          </div>
          <hr />
          <h2>Enter your PDF</h2>
          <input type="file" required onChange={(e) => setFile(e.target.files[0])} disabled={isEmpty(signer)} accept="application/pdf" />
        </div>
      }
    </div >
  );
}

export default App;

