---
template: tutorial.html
title: GraphLab API
---

# GraphLab API

We have approached GraphLab from different angles:

   * Lecture:
   Theory and high level programming model.
   * Homework 4:
   Use the command line of GraphLab toolkits.
   * Tutorial 11:
   Use GraphLab Create, the Python binding.

Function wise, the Python binding is equivalent to the toolkits.
Namely, you can only use existing algorithms programmed by other people.
In this tutorial, we take a deeper look into GraphLab.

## Workflow of programming towards GraphLab C++ API

Get the core package and compiler toolchain.

```bash
git clone https://github.com/graphlab-code/graphlab.git
sudo apt-get install gcc g++ build-essential libopenmpi-dev default-jdk cmake zlib1g-dev
```

Make a new dir under `demoapps`, e.g. `demoapps/engg4030`.
Create a file called `CMakeLists.txt`
with following content:

```bash
project(GraphLab)
add_graphlab_executable(hello hello.cpp)
```

Create the hello world example `hello.cpp`:

```cpp
#include <graphlab.hpp>
#include <iostream>
int main(int argc, char** argv) {
  graphlab::mpi_tools::init(argc, argv);
  graphlab::distributed_control dc;
  dc.cout() << "Hello World! (From distributed control)\n";
  std::cout << "Output per core! (From every core)" << std::endl;
  graphlab::mpi_tools::finalize();
}
```

You can create the project anywhere.
Just for convenience, we put it under `demoapps` dir,
so that `configure` script can find it directly.

The `configure` script will test your environment
and generate proper compiler commands for `/release` and `/debug`:

```bash
./configure
```

`/release` and `/debug` dir structure mirrors that of the project root.
You can find corresponding `Makefile` for debug/release binaries.

```bash
$ls release/demoapps/engg4030/
CMakeFiles  cmake_install.cmake  CTestTestfile.cmake  Makefile
$ls debug/demoapps/engg4030/
CMakeFiles  cmake_install.cmake  CTestTestfile.cmake  Makefile
```

Note, the `/release/*` or `/debug/*` does not contain codes.
They only contain build scripts and your codes are still in original position.

Compile the codes as follows:

```bash
cd debug/demoapps/engg4030/
make
```

Note that you can run more concurrent jobs for make, e.g. `make -j8`.
As a usual rule, let the concurrency less than number of CPUs.
As advised by GraphLab,
make the concurrency less than `Memory(G) / 1G`.

Summary of the workflow after preparation:

   * Modify your project under `demoapps/engg4030/`.
   * Go to `debug/demoapps/engg4030/` to `make` and execute.

## The Examples Repo

You can find all files used in this tutorial
[here](https://github.com/hupili/graphlab/tree/master/demoapps/engg4030).

Get via Git:
(note, not the GraphLab's official repo)

```bash
git clone https://github.com/hupili/graphlab.git
```

I made a [Makefile](https://github.com/hupili/graphlab/blob/master/demoapps/engg4030/Makefile)
to wrap the above workflow.
So you can modify and test the codes under `demoapps/engg4030` directly.
After modification, just run `make` under the same folder.
The built executables will be put under `output/`.

Here is a glimpse of the source codes:

   * `hello.cpp`.
   Hello world example from official tutorial.
   * `rpc.cpp`.
   RPC examples from tutorial.
   * `simple_pagerank_annotated.cpp`.
   Original PR under `/demoapps`, with more notes.
   * `pagerank_base.cpp`.
   Adapted from original PR to better diff with modifications.
   * `pagerank_scatter.cpp`.
   Original PR implementation is to gather shared weights from neighbours.
   This one scatters values to neighbouring edges.
   * `pagerank_fixed_iter_engine.cpp`.
   Only one-round of GAS.
   Start engine multiple times.
   Equivalent to matrix multiplication.
   * `pagerank_fixed_iter_vertex.cpp`.
   Fixed-round of GAS using vertex's self-scheduling.
   * `pagerank_simulation.cpp`.
   Compute PR via random walker simulation.

## GraphLab GAS Model

One common pattern for graph algorithms,
and many machine learning algorithms:
Gather-Apply-Scatter (GAS).

Lifecycle of a Vertex Program:

   * **gather_edges(contex, vertex)**:
   Specify what edges to gather data from,
   e.g. `IN_EDGES`, `OUT_EDGES`, `ALL_EDGES`, `NO_EDGES`.
   Note, you do not specify the edges directly.
   Instead, you specify those categories and the engine handles details.
   * **gather(context, vertex, edge)**:
   The function is applied on every edge specified by `gather_edges`.
   `vertex` is the current vertex.
   You can visit the other vertex via `edge.source()` or `edge.target()`.
   This function is usually used to collect data from the other vertex or the edge.
   Note that this function need to return a value of `GatherType` defined by you.
   It must support `operator+=`, which is used to merge data gathered from all edges.
   The system can automatically handle
   [plain old data](http://en.wikipedia.org/wiki/Plain_old_data_structure) (POD).
   * **apply(context, vertex, total)**:
   `total` is of `GatherType`.
   It is a summary of all the data `gather`-ed from neighbours.
   Use this function to update the state of current vertex.
   `vertex.data()` is usually modified at this stage.
   * **scatter_edges(contex, vertex)**:
   Similar to `gather_edges`.
   Specify the edges to scatter to.
   * **scatter(context, vertex, edge)**:
   Similar to `gather`.
   It is applied on edges specified by `scatter_edges`.
   One common operation in this function is to signal the neighbours,
   e.g. `context.signal(edge.target())`.

## Examples

### Hello World

[source](https://github.com/hupili/graphlab/blob/master/demoapps/engg4030/hello.cpp)

Key take-aways:

   * The structural parts of programming towards a GraphLab API.
   * Test the seamless migration from single-core to multi-core.
   `./output/hello`; `mpiexec -n 4 ./output/hello`

### Remote-Procedure-Call (RPC)

[source](https://github.com/hupili/graphlab/blob/master/demoapps/engg4030/rpc.cpp)

Key take-aways:

   * Low level collaboration via `distributed_control`.
   * Get basic information in multi-core environment.
   * Remote calls.

### PageRank from demoapps

[source](https://github.com/hupili/graphlab/blob/master/demoapps/engg4030/simple_pagerank_annotated.cpp)

Same as `demoapps/simple_pagerank_annotated.cpp`, with more annotations.

Key take-aways:

   * GAS model by subclassing `ivertex_program`.
   * CLI option handling.
   * The flow:
      * Load graph
      * Init vertex/edge data
      * Signal some initial vertex
      * Start engine
      * Post-processing via vertex/edge map/reduce/transform/fold, etc.
      * Write results
   * Usual CLI usage, e.g.
   `./output/simple_pagerank_annotated  --graph sample_tsv/tsv --format tsv --saveprefix sample_output/pr`
   Other GraphLab toolkits have similar flavour.

### PageRank Base

[source](https://github.com/hupili/graphlab/blob/master/demoapps/engg4030/pagerank_base.cpp)

This is same above PageRank, except for:

   * Many comments are stripped.
   * CLI options are fixed.
   It takes input from `sample_tsv` dir and
   output to `sample_output/pr_base`.

This is used as the base code for several alternative PageRank implementations,
so that you can get a quick understanding via `git diff`.

### PageRank: Scatter

[diff](https://github.com/hupili/graphlab/commit/6dc4398327ace3196ef439ff65ef1df4b0ef7a20)

[full source](https://github.com/hupili/graphlab/blob/master/demoapps/engg4030/pagerank_scatter.cpp)

Key take-away:

   * A more natural translation from the intuition of PageRank.
   * Edge can also have data and accessible by `gather`/`scatter`.
   * Similar initialization of edges.

### PageRank: Fixed iteration via vertex scheduling

[diff](https://github.com/hupili/graphlab/commit/ca4948d121a341c0cfcee39de586d9141fd4b965)

[full source](https://github.com/hupili/graphlab/blob/master/demoapps/engg4030/pagerank_fixed_iter_vertex.cpp)

Key take-away:

   * Use a struct as vertex data type.
   Serialization via `save`/`load`.
   * Control scheduling via `scatter_edges` specification.

### PageRank: Fixed iteration via engine scheduling

[diff](https://github.com/hupili/graphlab/commit/bbcd71ed68b19790cd581582d0d88d608fcea23e)

[full source](https://github.com/hupili/graphlab/blob/master/demoapps/engg4030/pagerank_fixed_iter_engine.cpp)

Key take-aways:

   * A generic template to implement embarrassingly parallel:
      * Computation in vertex program
      * Iteration via engine.

### PageRank: Simulating random walker

[diff](https://github.com/hupili/graphlab/commit/c966d6f0e4255b7ba7c9f73aad977870ff0feecc)

[full source](https://github.com/hupili/graphlab/blob/master/demoapps/engg4030/pagerank_simulation.cpp)

Key take-aways:

   * A more straightforward translation of PageRank.
   * Simulate random walker by signaling.
      * Jumping to neighbour by vertex signaling.
      * Jumping to random restarting node by engine signaling.

This is interesting as a learning example for the expressiveness of GraphLab.
However, there are some caveats of the implementation:

   * Random choice of neighbour or uniform node are not done by n-choose-1 routine.
   Instead, all candidates are selected independently.
   i.e. there can be none or more than one nodes selected.

Limitations of GAS:

   * Can not signal other vertices than neighbours.
   * Lack of object lists: neighbour vertex/edge list, global vertex/edge list.
   * Can not manipulate graph structure on the fly: e.g. break edges.

## Exercise

Implement distributed Bellman-Ford (the one used in RIP) using GraphLab's GAS model.

## Reference

   * Project repo:
   https://github.com/graphlab-code/graphlab
   * GraphLab tutorial:
   http://docs.graphlab.org/using_graphlab.html

## Outcome of This Tutorial

   * Learn GraphLab C++ API.
   Learn the GAS model.
   Learn how everything is stitched together
   (engine, life-cycle of a vertex program, barrier).
   * Try an important way to learn open source projects:
   trace code diff by commits.
   * Be prepared: you may need multiple languages in practice.
