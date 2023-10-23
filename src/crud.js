import React, { useState, useEffect } from "react";
import { db } from './fbconfig'; 
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'; 

function CRUD() {
  const [dataItem, setDataItem] = useState("");
  const [dataScpClass, setDataClass] = useState("");
  const [dataDescription, setDataDescription] = useState("");
  const [dataContainment, setDataContainment] = useState("");
  const [readData, setReadData] = useState([]);
  const [id, setId] = useState("");
  const OurCollection = collection(db, "subjects");

  // CRUD Create functionality
  const crudCreate = async () => {
    try {
      await addDoc(OurCollection, {
        Item: dataItem,
        scpClass: dataScpClass, 
        description: dataDescription,
        containment: dataContainment
      });

      // Clear input fields after a successful create
      setDataItem("");
      setDataClass("");
      setDataDescription("");
      setDataContainment("");
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
      containment: dataContainment
    });
  }

  const showEdit = async (id, item, scpClass, description, containment) => {
    setDataItem(item);
    setDataClass(scpClass);
    setDataDescription(description);
    setDataContainment(containment);
    setId(id);
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
        <input className="input-field" value={dataItem} onChange={(e) => setDataItem(e.target.value)} placeholder="Item" />
        <br />
        <input className="input-field" value={dataScpClass} onChange={(e) => setDataClass(e.target.value)} placeholder="Class" /> 
        <br />
        <input className="input-field" value={dataDescription} onChange={(e) => setDataDescription(e.target.value)} placeholder="Description" />
        <br />
        <input className="input-field" value={dataContainment} onChange={(e) => setDataContainment(e.target.value)} placeholder="Containment" />
        <br />
        <button className="button" onClick={crudCreate}>Create new document</button>
        <button className="button" onClick={crudUpdate}>Update Document</button>
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
              <div>
                <button className="button" onClick={() => crudDelete(item.id)}>Delete</button>
                <button className="button" onClick={() => showEdit(item.id, item.Item, item.scpClass, item.description, item.containment)}>Edit</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CRUD;
