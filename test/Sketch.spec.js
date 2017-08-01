const expect = require('chai').expect;

const Sketch = require('../lib/Sketch');

const Group = require('../lib/Group');
const Request = require('../lib/Request');
const Entity = require('../lib/Entity');
const Vector = require('../lib/Vector');

describe('Sketch', () => {
  it('constructor', () => {
    const sk = new Sketch();
    expect(sk).to.be.instanceOf(Sketch);
  });
  it('getConstraint');
  it('getEntity');
  it('clear');
  it('calculateEntityBBox');
  it('getRunningMeshGroupFor');

  describe('integration specs', () => {
    describe('with constraints', () => {
      it('can solve a same length constraint', () => {
        const sketch = new Sketch();

        const origin = new Entity({
          type: 'point-in-3d',
          param: [0, 0, 0],
          // actPoint: new Vector(0, 0, 0),
        });
        sketch.entities.addAndAssignId(origin);

        const planeUPoint = new Entity({
          type: 'point-in-3d',
          param: [1, 0, 0],
        });
        sketch.entities.addAndAssignId(planeUPoint);
        const planeU = new Entity({
          type: 'line-segment',
          point: [
            origin.h,
            planeUPoint.h,
          ],
        });
        sketch.entities.addAndAssignId(planeU);

        const planeVPoint = new Entity({
          type: 'point-in-3d',
          param: [0, 1, 0],
        });
        sketch.entities.addAndAssignId(planeVPoint);
        const planeV = new Entity({
          type: 'line-segment',
          point: [
            origin.h,
            planeVPoint.h,
          ],
        });
        sketch.entities.addAndAssignId(planeV);

        const group = new Group({
          type: 'drawing-workplane', // right type??
          subtype: 'workplane-by-line-segments',
          predef: {
            origin: origin.h,
            entityB: planeU.h,
            entityC: planeV.h,
          },
        });
        sketch.groups.addAndAssignId(group);

        // adapted from mouse.cpp:865 for a line segment
        // const request = new Request({
        //   type: 'line-segment',
        //   group,
        //   construction: false,
        //   // workplane: ????
        // });
        // sketch.request.addAndAssignId(request);
        // request.generate(sketch.entity, sketch.param);
        // adapted from mouse.cpp:956
        // request.h.entity(1).pointForceTo(new Vector(2, 5, 0));

        // console.log('entity 0', request.h.entity(0));
        // console.log('entity 1', request.h.entity(1));

        // console.log('entity 0 findById', sketch.entity.findById(request.h.entity(0)));
        // console.log('entity 1 findById', sketch.entity.findById(request.h.entity(1)));

        // TODO adapt SolveSpaceUI::SolveGroup (generate.cpp:538)
        // TODO adapt SolveSpaceUI::WriteEqSystemForGroup (generate.cpp:506)

        const solveResult = sketch.solveGroup(group.h);
        expect(group.solved).to.have.property('how', 'okay');

        // console.log(sketch);
        console.log(group);
        // console.log(sketch.system);

        // const line = new Entity({
        //   type: 'line-segment',
        //
        // })
        // const constraint = new Constraint({
        //   type: 'equal-length-lines',
        //   entityA: new Entity(),
        //   entityB: new Entity(),
        //   group: group.h,
        // });
        // constraint.addToSketch(sketch);
        expect(false).to.equal(true);
      });
    });
  });
});
