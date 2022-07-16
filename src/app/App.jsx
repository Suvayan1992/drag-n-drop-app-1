import React,{useState, useEffect} from 'react';
import './App.css';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
const data = [
    {
        id: "1",
        content: "Item-1"
    },
    {
        id: "2",
        content: "Item-2"
    },
    {
        id: "3",
        content: "Item-3"
    },
    {
        id: "4",
        content: "Item-4"
    },
    {
        id: "5",
        content: "Item-5"
    },
    {
        id: "6",
        content: "Item-6"
    },
    {
        id: "7",
        content: "Item-7"
    },
    {
        id: "8",
        content: "Item-8"
    },
    {
        id: "9",
        content: "Item-9"
    },
    {
        id: "10",
        content: "Item-10"
    },
];

const getListStyle = (isDraggingOver) => {
    //background: isDraggingOver ? "lightblue" : "lightgrey",
    return{
        background: "lightgrey",
        padding: 8,
        width: 250
    }
};

const getItemStyle = (isDragging, draggableStyle) => {
    console.log("Hi")
    return{
        userSelect: 'none',
        padding: 16,
        margin: '0 0 8px 0',
        background: isDragging? 'lightgreen' : 'greay',
        ...draggableStyle
    }
}



const App = () => {
    const [items, setItems] = useState([]);
    //const [itemIds, setItemIds] = useState([]);
    let lastClicked = [];
    
    const reorder = (startIndex, endIndex) => {
        let result = Array.from(items);
        let draggedElement = [];
        let lastElement = result[endIndex];
        if(lastClicked.length){
            lastClicked.forEach((id) => {
                let index = result.findIndex((item) => item.id === id);
                let [revoved] = result.splice(index, 1);
                draggedElement.push(revoved);
            });
            let lastIndex = result.findIndex((item) => item.id === lastElement.id);
            for(let i=0; i< draggedElement.length; i++){
                let index = lastIndex + i;
                result.splice(index, 0, draggedElement[i]);
            }
            lastClicked = [];
        }else{
            const [remove] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, remove);
        }
        return result;
    }

    useEffect(() => {
        setItems(data)
    },[]);

    const onDragEnd = (event) => {
        if(!event.destination){
            return;
        }
        const reorderedItems = reorder(event.source.index, event.destination.index);
        let element = document.getElementById(event.draggableId);
        if(element.classList.contains("selected")){
            let parent = document.querySelector("[data-rbd-droppable-id]");
            for(let i=0 ; i < parent.childNodes.length; i++){
                if(parent.childNodes[i].classList.contains("selected")){
                    parent.childNodes[i].classList.remove('selected');
                    parent.childNodes[i].classList.add('drged');
                }
            }
        }else{
            element.classList.remove('selected');
            element.classList.add('drged');
        }
        setItems(reorderedItems);
    }

    const onDragStart = (event) => {
        let parent = document.querySelector("[data-rbd-droppable-id]");
        for(let i=0 ; i < parent.childNodes.length; i++){
            if(parent.childNodes[i].classList.contains("drged")){
                parent.childNodes[i].classList.remove('drged');
            }
        }
    }

    
    const onSelect = (e) => {
        if(e.target.classList.contains("selected")){
            let index = lastClicked.indexOf(e.target.id);
            if( index > -1){
                lastClicked.splice(index, 1);
            }
            e.target.classList.remove("selected");
        }else {
            let parent = document.querySelector("[data-rbd-droppable-id]");
            for(let i=0 ; i < parent.childNodes.length; i++){
                if(parent.childNodes[i].classList.contains("drged")){
                    parent.childNodes[i].classList.remove('drged');
                }
            }
            if(e.ctrlKey || e.shiftKey){
                lastClicked.push(e.target.id)
                e.target.classList.add("selected");
            }else{
                let haveToRemove = Array.from(lastClicked);
                for(let i= 0; i < lastClicked.length ; i++){
                    let id = lastClicked[i];
                    let element = document.getElementById(id);
                    element.classList.remove("selected");
                }
                for(let i= 0; i < haveToRemove.length ; i++){
                    let id = haveToRemove[i];
                    let index = lastClicked.indexOf(id);
                    if( index > -1){
                        lastClicked.splice(index, 1);
                    }
                }
                lastClicked.push(e.target.id)
                e.target.classList.add("selected");
            }
            
        }
    }

    return (
        <div className="container my-5">
            <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
                <Droppable droppableId='droppableId' >
                    {
                        (provided, snapshot) => {
                            //console.log("Droppable : ", provided);
                            return(
                                <div 
                                    {...provided.droppableProps}
                                    ref = {provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}
                                >
                                    {provided.placeholder}
                                    {
                                        items.map((item, index) => (
                                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                                {
                                                    (provided, snapshot) => {
                                                        return(
                                                        <div
                                                            className="card"
                                                            id={item.id}
                                                            ref = {provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            onClick={onSelect}
                                                            onChange={getItemStyle}
                                                        >
                                                            {item.content}
                                                        </div>
                                                        )
                                                    }
                                                }
                                            </Draggable>
                                        ))
                                    }
                                </div>
                            )
                        }
                    }
                </Droppable>
            </DragDropContext>
        </div>
    )
}

export default App;