import React, { useState, useEffect } from "react";
import { db } from './fbconfig';
import {addDoc, collection, getDocs, deleteDoc, doc, updateDoc} from 'firebase/firestore';
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage';

function CRUD() {
  const [dataItem, setDataItem] = useState("");
  const [dataScpClass, setDataClass] = useState("");
  const [dataDescription, setDataDescription] = useState("");
  const [dataContainment, setDataContainment] = useState("");
  const [readData, setReadData] = useState([]);
  const [id, setId] = useState("");

  // Add states for image handling
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState("");

  const OurCollection = collection(db, "subjects"); 

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  }

  const uploadImage = async () => {
    if (image) {
      const storageRef = ref(getStorage(), "images/" + image.name);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on("state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload " + progress + "% done.");
        },
        (error) => {
          console.log(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageURL(downloadURL);
        }
      );
    }
  }

  // CRUD Create functionality
  const crudCreate = async () => {
    try {
      await addDoc(OurCollection, {
        Item: dataItem,
        scpClass: dataScpClass,
        description: dataDescription,
        containment: dataContainment,
        imageURL: imageURL,
      });

      // Clear input fields after a successful create
      setDataItem("");
      setDataClass("");
      setDataDescription("");
      setDataContainment("");
      setImageURL("");
    } catch (error) {
      console.error("Error creating document:", error);
    }
  }

  // CRUD delete functionality
  const crudDelete = async (id) => {
    const docToDelete = doc(db, "subjects", id);
    await deleteDoc(docToDelete);
  }

  // CRUD Update/Edit Functionality
  const crudUpdate = async () => {
    const updateData = doc(db, "subjects", id);
    await updateDoc(updateData, {
      Item: dataItem,
      scpClass: dataScpClass,
      description: dataDescription,
      containment: dataContainment,
      imageURL: imageURL,
    });
  }

  const showEdit = async (id, item, scpClass, description, containment, imageURL) => {
    setDataItem(item);
    setDataClass(scpClass);
    setDataDescription(description);
    setDataContainment(containment);
    setId(id);
    setImageURL(imageURL);
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const ourDocsToRead = await getDocs(OurCollection);
        const sortedData = ourDocsToRead.docs.map(doc => ({ ...doc.data(), id: doc.id })).sort((a, b) => a.Item.localeCompare(b.Item));
        setReadData(sortedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    getData();
  }, [OurCollection]); 

  return (
      <div className="container">
        <h1 className="header">SCP FILES</h1>
    
        <div className="input-container">
  <input
    className="input-field"
    value={dataItem}
    onChange={(e) => setDataItem(e.target.value)}
    placeholder="Item"
  />
  <input
    className="input-field"
    value={dataScpClass}
    onChange={(e) => setDataClass(e.target.value)}
    placeholder="Class"
  />
  <input
    className="input-field"
    value={dataDescription}
    onChange={(e) => setDataDescription(e.target.value)}
    placeholder="Description"
  />
  <input
    className="input-field"
    value={dataContainment}
    onChange={(e) => setDataContainment(e.target.value)}
    placeholder="Containment"
  />

  <label htmlFor="fileInput" className="btn btn-secondary black-btn">
    <i className="fas fa-upload" style={{ color: 'black' }}></i>
  </label>

  <input
    className="form-control"
    type="file"
    id="fileInput"
    style={{ display: 'none' }}
    onChange={handleImageChange}
  />

  <button className="button" onClick={crudCreate}>
    Create new document
  </button>

  <button className="button" onClick={crudUpdate}>
    Update Document
  </button>

  <button className="button" onClick={uploadImage}>
    Upload Image
  </button>
</div>

    
        <div className="list-container">
          <ul>
            {readData.map((item) => (
              <li key={item.id}>
                {item.Item} - {item.scpClass}
                <br />
                Description: {item.description}
                <br />
                Containment: {item.containment}
    
                {item.imageURL && (
                  <div className="image-container">
                    <img className="image" src={item.imageURL} alt={item.imageURL} />
                  </div>
                )}
    
                <div className="button-container">
                  <button className="button" onClick={() => crudDelete(item.id)}>Delete</button>
                  <button className="button" onClick={() => showEdit(item.id, item.Item, item.scpClass, item.description, item.containment, item.imageURL)}>Edit</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
}

export default CRUD;
