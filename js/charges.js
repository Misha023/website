(function() {
    var WIDTH = 800;
    var HEIGHT = 600;
    var MINDIST = 150;
    var MINDISTSQ = MINDIST*MINDIST;
    var NPOINTS = 100;
    var MINSPEED = 0.05;
    var MAXSPEED = 0.1;
    var GRAVITATIONAL_CONSTANT = 0.5;
    var MINMASS = 1;
    var MAXMASS = 5;

    // Get canvas rendering context
    var canvas = document.getElementById('charges');
    var ctx = canvas.getContext('2d');

    // The points
    var points = [];
    for (var i = 0; i < NPOINTS; i++) {
        var angle = Math.random() * Math.PI * 2;
        var speed = MINSPEED + (Math.random() * (MAXSPEED - MINSPEED));
        points.push({
            charge: i % 2,
            x: -MINDIST + (Math.random() * (WIDTH + (2 * MINDIST))),
            y: -MINDIST + (Math.random() * (HEIGHT + (2 * MINDIST))),
            vel: {
                x: speed * Math.cos(angle),
                y: speed * Math.sin(angle)
            },
            mass: MINMASS + (Math.random() * (MAXMASS - MINMASS))
        });
    }

    // Start animating
    var lastTime = new Date().getTime();
    animate();
    function animate() {
        requestAnimationFrame(animate);

        // Get the amount of time that passed between frames
        var curTime = new Date().getTime();
        var animScale = (curTime - lastTime) / 16;
        lastTime = curTime;
        // Update the point velocities
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            for (var j = 0; j < points.length; j++) {
                if (i === j) {
                    continue;
                }
                var q = points[j];
                var diff = { x: q.x - p.x, y: q.y - p.y };
                var distSq = (diff.x * diff.x) + (diff.y * diff.y);
                if (distSq < 5) {
                    continue;
                }
                var force = GRAVITATIONAL_CONSTANT * p.mass * q.mass / distSq;
                var accel = force / p.mass;
                if (p.charge == q.charge) {
                    accel *= -1;
                }
                var dist = Math.sqrt(distSq);
                var u = { x: diff.x / dist, y: diff.y / dist };
                p.vel.x += accel * u.x;
                p.vel.y += accel * u.y;
            }
        }
        // Update the point positions
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            p.x += animScale * p.vel.x;
            p.y += animScale * p.vel.y;
            while (p.x < -MINDIST) {
                p.x += WIDTH + (2 * MINDIST);
            }
            while (WIDTH + MINDIST < p.x) {
                p.x -= WIDTH + (2 * MINDIST);
            }
            while (p.y < -MINDIST) {
                p.y += HEIGHT + (2 * MINDIST);
            }
            while (HEIGHT + MINDIST < p.y) {
                p.y -= HEIGHT + (2 * MINDIST);
            }
        }
        // Fill background
        ctx.fillStyle = '#112222';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        // Function to choose color based on charge
        var chooseColor = function(charge) {
            return charge ? '#66FFFF' : '#FF6666';
        };

        // Draw the lines
        ctx.lineWidth = 1;
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            for (var j = 0; j < points.length; j++) {
                var q = points[j];
                var distSq = Math.pow(p.x - q.x, 2) + Math.pow(p.y - q.y, 2);
                var alpha = 1 - (distSq / MINDISTSQ);
                if (alpha < 0) {
                    continue;
                }
                var grad = ctx.createLinearGradient(p.x, p.y, q.x, q.y);
                grad.addColorStop(0, chooseColor(p.charge));
                grad.addColorStop(1, chooseColor(q.charge));
                ctx.strokeStyle = grad;
                ctx.globalAlpha = Math.pow(alpha, 10);
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(q.x, q.y);
                ctx.stroke();
            }
        }
        // Draw the points
        ctx.fillStyle = '#99FFFF';
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            var r = 2 + (p.mass / MAXMASS);
            ctx.fillStyle = chooseColor(p.charge);
            ctx.beginPath();
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.fill();
        }
    }
})();