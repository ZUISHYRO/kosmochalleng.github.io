import React, { useRef, useState } from "react";
import Moveable from "react-moveable";

const App = () => {
  const [moveableComponents, setMoveableComponents] = useState([]);
  const [selected, setSelected] = useState(null);
  const parentRef = useRef();

  const addMoveable = () => {
    const COLORS = ["red", "blue", "yellow", "green", "purple"];

    fetch("https://jsonplaceholder.typicode.com/photos")
      .then((response) => response.json())
      .then((data) => {
        const randomIndex = Math.floor(Math.random() * data.length);
        const photo = data[randomIndex].url;

        setMoveableComponents((prevMoveableComponents) => [
          ...prevMoveableComponents,
          {
            id: Math.floor(Math.random() * Date.now()),
            top: 0,
            left: 0,
            width: 100,
            height: 100,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            photo: photo,
            fit: "cover",
          },
        ]);
      });
  };

  const removeMoveable = (id) => {
    setMoveableComponents((prevMoveableComponents) =>
      prevMoveableComponents.filter((moveable) => moveable.id !== id)
    );
  };

  const updateMoveable = (id, newComponent) => {
    setMoveableComponents((prevMoveableComponents) =>
      prevMoveableComponents.map((moveable) => {
        if (moveable.id === id) {
          return { id, ...newComponent };
        }
        return moveable;
      })
    );
  };

  const handleClick = (id) => {
    setSelected(id);
  };

  return (
    <main style={{ height: "100vh", width: "100vw" }}>
      <button onClick={addMoveable}>Add Moveable</button>
      <div
        ref={parentRef}
        id="parent"
        style={{
          position: "relative",
          background: "black",
          height: "80vh",
          width: "80vw",
        }}
      >
        {moveableComponents.map((item) => (
          <Component
            key={item.id}
            {...item}
            updateMoveable={updateMoveable}
            handleClick={handleClick}
            isSelected={selected === item.id}
            removeMoveable={removeMoveable}
            parentBounds={parentRef.current.getBoundingClientRect()}
          />
        ))}
      </div>
    </main>
  );
};

const Component = ({
  id,
  top,
  left,
  width,
  height,
  color,
  photo,
  fit,
  updateMoveable,
  handleClick,
  isSelected,
  removeMoveable,
  parentBounds,
}) => {
  const ref = useRef();
    /**
   * Maneja el evento de cambio de tamaño de Moveable.
   * @param {object} e - Objeto de evento de cambio de tamaño
   */

  const onResize = (e) => {
    const { width: newWidth, height: newHeight } = e;

    if (top + newHeight > parentBounds.height) {
      e.height = parentBounds.height - top;
      e.y = 0;
    }

    if (left + newWidth > parentBounds.width) {
      e.width = parentBounds.width - left;
      e.x = 0;
    }

    updateMoveable(id, {
      top,
      left,
      width: e.width,
      height: e.height,
      color,
      photo,
      fit,
    });
  };
    /**
   * Maneja el evento de arrastre de Moveable.
   * @param {object} e - Objeto de evento de arrastre
   */

  const onDrag = (e) => {
    const { top: newTop, left: newLeft } = e;

    if (newTop < 0) {
      e.top = 0;
    } else if (newTop + height > parentBounds.height) {
      e.top = parentBounds.height - height;
    }

    if (newLeft < 0) {
      e.left = 0;
    } else if (newLeft + width > parentBounds.width) {
      e.left = parentBounds.width - width;
    }

    updateMoveable(id, {
      top: e.top,
      left: e.left,
      width,
      height,
      color,
      photo,
      fit,
    });
  };
    /**
   * Maneja el evento de eliminación de un componente.
   * @param {object} e - Objeto de evento de click
   */

  const handleRemove = (e) => {
    e.stopPropagation();
    removeMoveable(id);
  };

  return (
    <div
      ref={ref}
      className={`draggable ${isSelected ? "selected" : ""}`}
      id={"component-" + id}
      style={{
        position: "absolute",
        top,
        left,
        width,
        height,
        background: color,
        backgroundImage: `url(${photo})`,
        backgroundSize: fit,
      }}
      onClick={() => handleClick(id)}
    >
      {isSelected && (
        <button
          className="remove-button"
          onClick={handleRemove}
          style={{
            position: "absolute",
            top: "-10px",
            right: "-10px",
            background: "red",
            color: "white",
            padding: "5px",
            border: "none",
            cursor: "pointer",
          }}
        >
          X
        </button>
      )}
      {isSelected && (
        <Moveable
          target={ref.current}
          resizable
          draggable
          onDrag={onDrag}
          onResize={onResize}
          keepRatio={false}
          throttleResize={1}
          renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
          edge={false}
          zoom={1}
          origin={false}
          padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
        />
      )}
    </div>
  );
};

export default App;
