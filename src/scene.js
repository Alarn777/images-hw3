const PROJECTION = {
    PERSPECTIVE: "PERSPECTIVE",
    PARALLEL_ORTHOGONAL: "PARALLEL_ORTHOGONAL",
    PARALLEL_OBLIQUE: "PARALLEL_OBLIQUE",
};

class Scene {
    constructor(x, y, z, width, height, figures) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.radius = 50;
        this.ctx = null;
        this.width = width;
        this.height = height;
        this.figures = figures;
        this.sceneVertices = [];
        this.scenePolygons = [];
        this.loadFigures();
        this.perspectiveDepth = this.width * 0.6;
    }
    setCtx(ctx) {
        this.ctx = ctx;
    }
    loadFigures() {
        let figuresShift = 0;
        for (const f of this.figures) {
            for (const v of f.vertices) {
                this.sceneVertices.push(v);
            }

            for (let i = 0; i < f.polygons.length; i++) {
                const p = f.polygons[i];
                this.scenePolygons.push({
                    vertices: p.map((x) => {
                        return x + figuresShift;
                    }),
                    color: f.colors[i],
                });
            }
            figuresShift = figuresShift + f.vertices.length;
        }
    }

    setNewValues(x, y, z) {
        this.x = x;
        this.z = z;
        this.y = y;
    }

    changeRadius(rad) {
        this.radius = rad;
    }

    // Project the 3D position into the 2D canvas
    perspectiveProject(vertex) {
        const depth = this.perspectiveDepth / (this.perspectiveDepth + vertex.z);
        const xProject =
            this.width / 2 + vertex.x / (1 + vertex.z / this.perspectiveDepth);
        const yProject =
            this.height / 2 + vertex.y / (1 + vertex.z / this.perspectiveDepth);
        return {
            depth: depth,
            x: xProject,
            y: yProject,
        };
    }

    parallelOrthographicProject(vertex) {
        return {
            depth: this.perspectiveDepth / (this.perspectiveDepth + vertex.z),
            x: this.width / 2 + vertex.x,
            y: this.height / 2 + vertex.y,
            z: 0,
        };
    }

    parallelObliqueProject(vertex) {
        return {
            depth: this.perspectiveDepth / (this.perspectiveDepth + vertex.z),
            x: this.width / 2 + vertex.x + 0.5 * vertex.z * Math.cos(45),
            y: this.height / 2 + vertex.y + 0.5 * vertex.z * Math.sin(45),
            z: 0,
        };
    }

    draw(projection) {
        let projectedPolygons = [];
        for (const p of this.scenePolygons) {


            projectedPolygons.push({
                projectedVertices: p.vertices.map((x) => {
                    let v = {
                        x: this.x + this.radius * this.sceneVertices[x][0],
                        y: this.y + this.radius * this.sceneVertices[x][1],
                        z: this.z + this.radius * this.sceneVertices[x][2],
                    };
                    switch (projection) {
                        case PROJECTION.PARALLEL_OBLIQUE:
                            return this.parallelObliqueProject(v);
                        case PROJECTION.PARALLEL_ORTHOGONAL:
                            return this.parallelOrthographicProject(v);
                        case PROJECTION.PERSPECTIVE:
                            return this.perspectiveProject(v);
                        default:
                            return this.perspectiveProject(v);
                    }
                }),
                color: p.color,
            });
        }

        projectedPolygons.sort((a, b) => {
            return (
                Math.min(...a.projectedVertices.map((v) => v.depth)) -
                Math.min(...b.projectedVertices.map((v) => v.depth))
            );
        });

        for (const p of projectedPolygons) {
            this.ctx.beginPath();
            this.ctx.moveTo(p.projectedVertices[0].x, p.projectedVertices[0].y);
            for (let i = 1; i < p.projectedVertices.length; i++) {
                let v = p.projectedVertices[i];
                this.ctx.lineTo(v.x, v.y);
            }
            this.ctx.closePath();
            this.ctx.strokeStyle = p.color; //"#FF000F";
            this.ctx.stroke();
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
        }
    }
}

export { Scene, PROJECTION };