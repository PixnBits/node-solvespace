Porting Knowledge
=================

Variable Decoding
-----------------

### Encountered
* `SK`: Sketch (`src/solvescpace.cpp:11`)
* `SS`: SolveSpaceUI (`src/solvespace.cpp:10`)
  * `SS.GW`: GraphicsWindow (`src/solvespace.h:623` `src/platform/gtkmain.cpp:577` `src/platform/cocoamain.mm:443`)
    * `SS.GW.gs` (`src/ui.h:798`)
  * `SS.TW`: TextWindow (`src/solvespace.h:622`)
* `hWhatever`:  handles are a 32-bit ID, that is used to represent some data structure in the sketch. (`src/sketch.h:51`)

### Potentials

Program Flow
-------------

* as a library: `Slvs_Solve` ([`src/lib.cpp`](https://github.com/solvespace/solvespace/blob/bb2cc4aa568e7206bdc2d02cb3e0eb8b8d3364c5/src/lib.cpp#L81-L259))
* Loading a file: `SolveSpaceUI::LoadFromFile` (`src/file.cpp:429`)
  ```
  ClearExisting();
  maybe LoadUsingTable(key, val);
  'AddGroup' ==> SK.group.Add
  'AddParam' ==> SK.param.Add
  'AddRequest' ==> SK.request.Add
  'AddConstraint' ==> SK.constraint.Add
  ```
* Menu Command, add a Line Segment
  * button in menu (`src/graphicswin.cpp:112`)
  * operation (`src/graphicswin.cpp:1024`)
    * help text line 1024
    * edits a pending operation: `SS.GW.pending.{operation,command,description}` (`src/graphicswin.cpp:1033-1035`)
    * invokes `SolveSpaceUI::ScheduleShowTW()` which sets a flag used to call `TW.Show();` (`src/textwin.cpp:461`)
  * Left Mouse Button click `src/mouse.cpp:956`
    * AddRequest
      * creates a `Request`
      * active group
      * sets construction flag
      * active workplane
      * sets request type from argument
      * `SK.request.AddAndAssignId(&r);`
      *
      ```
      // We must regenerate the parameters, so that the code that tries to
      // place this request's entities where the mouse is can do so. But
      // we mustn't try to solve until reasonable values have been supplied
      // for these new parameters, or else we'll get a numerical blowup.
      ```
      invokes `Request::Generate` passing SK (global) entity and param lists
      * marks the request's group dirty (`SolveSpaceUI::MarkGroupDirty`)
      * returns `.h` so hRequest ? (pointer, id?)
    * AddToPending
    * `SK.GetEntity(hr.entity(1))->PointForceTo(v);` seems instrumental (`src/mouse.cpp:961`, `src/entity.cpp:406`)
