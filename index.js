var requestID = 0;
const scale = 1000;
var coordinateX = 0;
var coordinateY = 0;
const color = "--color";
const size = "--size";
const { availWidth, availHeight } = screen;
const centreOfSystem = { x: availWidth / 2, y: availHeight / 3 };
const Planets = {
  sun: {
    radius: 69600,
    node: null,
    distanceToTheSun: 0,
    name: "sun",
    background: "yellow",
    rotationSpeed: 0,
    speed: 0,
  },
  mercure: {
    radius: 240,
    node: null,
    distanceToTheSun: 58,
    name: "mercure",
    background: "green",
    rotationSpeed: 0.01728,
    speed: 0,
  },
  venus: {
    radius: 6000,
    node: null,
    distanceToTheSun: 108,
    name: "venus",
    background: "#c4ba93",
    rotationSpeed: 0.0126,
    speed: 0,
  },
  earth: {
    radius: 6400,
    node: null,
    distanceToTheSun: 150,
    name: "earth",
    background: "#5ebdf7",
    rotationSpeed: 0.01044,
    speed: 0,
    children: [{ radius: 50, node: null, name: "moon", background: "#fff" }],
  },
  mars: {
    radius: 3200,
    node: null,
    distanceToTheSun: 227,
    name: "mars",
    background: "#ec5f1a",
    rotationSpeed: 0.00864,
    speed: 0,
  },
  jupiter: {
    radius: 51000,
    node: null,
    distanceToTheSun: 778,
    name: "jupiter",
    background: "#99690d",
    rotationSpeed: 0.00468,
    speed: 0,
    children: [
      { radius: 5000, node: null, name: "europe", background: "#65f2d1" },
      {
        radius: 6000,
        node: null,
        name: "callisto",
        background: "#65f2d1",
      },
    ],
  },
  saturne: {
    radius: 40000,
    node: null,
    distanceToTheSun: 1457,
    name: "saturne",
    background: "#846832",
    rotationSpeed: 0.0036,
    speed: 0,
  },
  uranus: {
    radius: 15650,
    node: null,
    distanceToTheSun: 1970,
    name: "uranus",
    background: "#65f2d1",
    rotationSpeed: 0.00252,
    speed: 0,
  },
  neptune: {
    radius: 15000,
    node: null,
    distanceToTheSun: 2200,
    name: "neptune",
    background: "#65a9f2",
    rotationSpeed: 0.0018,
    speed: 0,
  },
};

function isNumber(number) {
  if (typeof number != "number") {
    return false;
  }
  return true;
}

function drawPlanet(planet) {
  const { radius, name, background, children } = planet || {};

  if (!isNumber(radius) || !name || !background) {
    throw new Error(
      `drawPlanet function: {name: ${name}, radius: ${radius}, background: ${background}}`
    );
  }

  const _radius = radius / scale;
  planet.node = document.getElementById(name);
  if (!planet.node) {
    throw new Error(`Element not found in html: ID: ${name}`);
  }
  planet.node.style.setProperty(size, _radius * 2 + "px");
  planet.node.style.setProperty(color, background);
  planet.node.innerHTML = name;

  if (children && children.length) {
    children.forEach((child) => drawPlanet(child));
  }
}

function setCenter(satellite, planetRadius, coordinateX, coordinateY) {
  const { node, radius } = satellite;
  const _radius = radius / scale;
  node.style.left = coordinateX + planetRadius - _radius - 1 + "px";
  node.style.top = coordinateY + planetRadius - _radius - 1 + "px";
}

function setPlanetPosition(planet) {
  const {
    radius,
    distanceToTheSun,
    node,
    rotationSpeed,
    speed,
    children,
  } = planet;

  if (
    !isNumber(radius) ||
    !isNumber(distanceToTheSun) ||
    !node ||
    !isNumber(rotationSpeed) ||
    !isNumber(speed)
  ) {
    cancelAnimationFrame(requestID);
    throw new Error("setPlanetPosition function");
  }

  planet.speed += rotationSpeed;

  const _distanceToTheSun = distanceToTheSun / 5;
  const { x, y } = centreOfSystem || {};

  if (x && y) {
    const sunRadius = Planets.sun.radius / scale;
    const planetRadius = radius / scale;
    const distanceFromTheCenter = _distanceToTheSun + sunRadius;

    coordinateX = x + Math.sin(speed) * distanceFromTheCenter - planetRadius;
    coordinateY = y + Math.cos(speed) * distanceFromTheCenter - planetRadius;
    node.style.left = coordinateX + "px";
    node.style.top = coordinateY + "px";
    // set satellites
    if (children && children.length) {
      children.forEach((child) =>
        setCenter(child, planetRadius, coordinateX, coordinateY)
      );
    }
  } else {
    console.log("context: Planet; - position not provided ");
  }
}

function animate() {
  requestID = requestAnimationFrame(animate);
  setPlanetPosition(Planets.mercure);
  setPlanetPosition(Planets.venus);
  setPlanetPosition(Planets.earth);
  setPlanetPosition(Planets.mars);
  setPlanetPosition(Planets.jupiter);
  setPlanetPosition(Planets.saturne);
  setPlanetPosition(Planets.uranus);
  setPlanetPosition(Planets.neptune);
}

function init() {
  for (let key in Planets) {
    drawPlanet(Planets[`${key}`]);
  }

  const { node, radius } = Planets.sun;
  node.style.left = centreOfSystem.x - radius / scale + "px";
  node.style.top = centreOfSystem.y - radius / scale + "px";

  animate();
}
