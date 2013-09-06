// Generated by CoffeeScript 1.6.3
(function() {
  var animate, animateTick, animating, arrow, body, body_height, body_radius, bodyg, bot, camera, clr, coords, drag_start, flat_blue, flat_gray, game, gray, group, head, head_radius, headg, i, level_1_1, level_1_3, light, moveBotTo, renderer, rgb, row, scene, square, start_rot, step, stp, toggleGoal, tops, tri, turnBotTo, updateScene, wireframe, x, y, _i, _j, _k, _len, _len1, _ref, _ref1, _ref2, _ref3;

  level_1_1 = {
    "board": [
      [{}, {}, {}], [
        {}, {}, {
          "goal": true
        }
      ], [{}, {}, {}]
    ],
    "bot": {
      "x": 0,
      "y": 1,
      "dir": 1
    },
    "prog": {
      "main": [
        {
          "action": "forward"
        }, {
          "action": "forward"
        }, {
          "action": "bulb"
        }
      ]
    }
  };

  level_1_3 = {
    "board": [
      [
        {}, {}, {
          "goal": true
        }
      ], [
        {
          "elev": 1
        }, {
          "elev": 1
        }, {
          "elev": 1
        }
      ], [{}, {}, {}]
    ],
    "bot": {
      "x": 0,
      "y": 2,
      "dir": 1
    },
    "prog": {
      "main": [
        {
          "action": "forward"
        }, {
          "action": "forward"
        }, {
          "action": "left"
        }, {
          "action": "jump"
        }, {
          "action": "jump"
        }, {
          "action": "bulb"
        }
      ]
    }
  };

  rgb = function(clr) {
    return {
      green: 0x00ff00,
      red: 0xff0000,
      teal: 0x00bbbb,
      yellow: 0xffff00
    }[clr];
  };

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);

  camera.position.z = 1500;

  scene = new THREE.Scene;

  updateScene = function() {
    return renderer.render(scene, camera);
  };

  light = new THREE.PointLight(0xffffff, 1.0, 0);

  light.position.set(300, -100, 500);

  scene.add(light);

  window.group = group = new THREE.Object3D;

  group.name = 'group';

  flat_gray = new THREE.MeshLambertMaterial({
    color: 0xcccccc,
    shading: THREE.FlatShading
  });

  gray = new THREE.MeshLambertMaterial({
    color: 0xcccccc
  });

  flat_blue = new THREE.MeshLambertMaterial({
    color: 0x0000ff,
    shading: THREE.FlatShading
  });

  wireframe = new THREE.MeshBasicMaterial({
    wireframe: true,
    wireframeLinewidth: 2,
    color: 0x666666
  });

  bot = new THREE.Object3D;

  bot.name = 'bot';

  head_radius = 40;

  body_radius = 40;

  body_height = 150;

  headg = new THREE.SphereGeometry(head_radius, 40);

  head = new THREE.Mesh(headg, gray);

  head.name = 'head';

  head.position.y = body_height / 2 + head_radius;

  bot.add(head);

  bodyg = new THREE.CylinderGeometry(body_radius, body_radius, body_height, 20);

  body = new THREE.Mesh(bodyg, gray);

  body.name = 'body';

  bot.add(body);

  tri = new THREE.Shape;

  tri.moveTo(-50, -90);

  tri.lineTo(0, 90);

  tri.lineTo(50, -90);

  tri.lineTo(-50, -90);

  arrow = new THREE.Mesh(tri.extrude({
    amount: 20
  }), flat_blue);

  arrow.name = 'arrow';

  arrow.rotation.x = Math.PI / 2;

  arrow.rotation.z = Math.PI;

  bot.add(arrow);

  bot.rotation.x = Math.PI / 2;

  group.add(bot);

  tops = [];

  step = function(x, y, height, color) {
    var geom, grp, mat, plane, top;
    if (height == null) {
      height = 2;
    }
    if (color == null) {
      color = null;
    }
    grp = new THREE.Object3D;
    grp.name = 'step';
    geom = new THREE.CubeGeometry(200, 200, height);
    grp.add(THREE.SceneUtils.createMultiMaterialObject(geom, [flat_gray, wireframe]));
    if (color) {
      top = new THREE.Object3D;
      top.position.z = height / 2 + 1;
      geom = new THREE.PlaneGeometry(200, 200);
      mat = new THREE.MeshBasicMaterial({
        color: rgb(color)
      });
      plane = new THREE.Mesh(geom, mat);
      if (tops[y] == null) {
        tops[y] = [];
      }
      tops[y][x] = plane;
      top.add(plane);
      grp.add(top);
    }
    grp.position.x = x * 200;
    grp.position.y = -y * 200;
    return grp;
  };

  game = Lightbot.Game.load(level_1_3);

  animating = 0;

  animateTick = function() {
    if (!animating) {
      return;
    }
    requestAnimationFrame(animateTick);
    return TWEEN.update();
  };

  animate = function(obj, ms, to) {
    animating++;
    new TWEEN.Tween(obj).to(to, ms).easing(TWEEN.Easing.Quadratic.InOut).interpolation(TWEEN.Interpolation.Bezier).onUpdate(updateScene).onComplete(function() {
      return animating--;
    }).start();
    if (animating === 1) {
      return animateTick();
    }
  };

  moveBotTo = function(x, y) {
    var coords, elev, from_z, to_z;
    coords = {
      x: x * 200,
      y: y * -200
    };
    elev = game.board[y][x].elev;
    to_z = body_height / 2 + 1 + elev * 100;
    from_z = bot.position.z;
    if (to_z !== from_z) {
      coords.z = [Math.max(to_z, from_z) + 100, to_z];
    }
    return animate(bot.position, 1000, coords);
  };

  turnBotTo = function(dir) {
    return animate(bot.rotation, 1000, {
      y: (4 - dir) * Math.PI / 2
    });
  };

  toggleGoal = function(x, y, tagged) {
    tops[y][x].material.color.setHex(rgb(tagged ? 'yellow' : 'teal'));
    return updateScene();
  };

  _ref = game.board;
  for (y = _i = 0, _len = _ref.length; _i < _len; y = ++_i) {
    row = _ref[y];
    for (x = _j = 0, _len1 = row.length; _j < _len1; x = ++_j) {
      square = row[x];
      clr = square.goal ? 'teal' : square.color;
      if (square.lift) {
        throw 'lifts not supported';
      } else {
        if (square.elev === 0) {
          stp = step(x, y, null, clr);
          stp.position.z = 1;
          group.add(stp);
        } else {
          for (i = _k = 0, _ref1 = square.elev; 0 <= _ref1 ? _k < _ref1 : _k > _ref1; i = 0 <= _ref1 ? ++_k : --_k) {
            stp = step(x, y, 100, (i === square.elev ? clr : null));
            stp.position.z = 50 + 100 * i;
            group.add(stp);
          }
        }
      }
    }
  }

  group.rotation.x = Number((_ref2 = localStorage.getItem('x_rot')) != null ? _ref2 : -7.6);

  group.rotation.y = Number((_ref3 = localStorage.getItem('y_rot')) != null ? _ref3 : 0);

  scene.add(group);

  moveBotTo(game.bot.x, game.bot.y);

  turnBotTo(game.bot.dir);

  drag_start = null;

  start_rot = [group.rotation.x, group.rotation.y];

  document.body.addEventListener('mousedown', function(e) {
    if (e.button === 0) {
      return drag_start = [e.clientX, e.clientY];
    }
  });

  document.body.addEventListener('mouseup', function() {
    drag_start = null;
    start_rot = [group.rotation.x, group.rotation.y];
    localStorage.setItem('x_rot', group.rotation.x);
    return localStorage.setItem('y_rot', group.rotation.y);
  });

  coords = document.getElementById('coords').firstChild;

  document.body.addEventListener('mousemove', function(e) {
    var dx, dy;
    if (!drag_start) {
      return;
    }
    dx = e.clientX - drag_start[0];
    dy = e.clientY - drag_start[1];
    group.rotation.x = start_rot[0] + dy / 100;
    group.rotation.y = start_rot[1] + dx / 100;
    return updateScene();
  });

  document.getElementById('reset').addEventListener('click', function(e) {
    group.rotation.x = group.rotation.y = 0;
    localStorage.removeItem('x_rot');
    localStorage.removeItem('y_rot');
    updateScene();
    return false;
  });

  game.on('moveBot', moveBotTo);

  game.on('turnBot', turnBotTo);

  game.on('toggleGoal', toggleGoal);

  game.on('gameOver', function(reason) {
    return coords.nodeValue = "You " + reason;
  });

  setInterval((function() {
    return game.tick();
  }), 2000);

}).call(this);

/*
//@ sourceMappingURL=demo.map
*/
