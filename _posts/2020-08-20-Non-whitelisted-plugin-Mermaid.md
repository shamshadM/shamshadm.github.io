---
title: "Add non-whitelisted plugins and Mermaid"
excerpt_separator: <!--more-->
date: 2020-08-20
permalink: /posts/2020/08/non-whitelisted-plugin-Mermaid/
toc: true
categories: CI mermaid
tags:
  - Mermaid
  - graph
  - non-whitelisted plugins
---
GitHub Pages runs in `safe` mode and only allows [a set of whitelisted plugins](https://pages.github.com/versions/). To use the gem in GitHub Pages, one of the workarounds is to use CI (e.g. travis, github workflow) and deploy to your `gh-pages` branch like: [jekyll-deploy-action](https://github.com/jeffreytse/jekyll-deploy-action), and I use this plugin: [jekyll-spaceship](https://github.com/jeffreytse/jekyll-spaceship) in my github pages.
<!--more-->
## Using mermaid in github pages

Above `jekyll-spaceship` plugin can render the mermaid code but not very well as described [here](https://github.com/jeffreytse/jekyll-spaceship/issues/60).

Currently, there're two better solutions by using the [mermaid javascript API](https://mermaid-js.github.io/mermaid/#/n00b-gettingStarted?id=_3-calling-the-javascript-api).

The **first solution** is to use the mermaid API directly, it's inspired by this [post](https://jojozhuang.github.io/tutorial/jekyll-diagram-with-mermaid/). You can refer to this [commit](https://github.com/copdips/copdips.github.io/commit/6e9fde29abff7691ccfd7b7b0ad7158651931ed5) to see how to use it. The steps are as follows:

1. create a file `mermaid.html` inside the folder `_includes`. The file content could be found on the [mermaid js official website](https://mermaid-js.github.io/mermaid/#/n00b-gettingStarted?id=_3-calling-the-javascript-api).
2. update the file `_includes/head.html` to include the new file `mermaid.html` with or without the condition on the var `page.mermaid`
3. in post where we need to render the mermaid diagrams, just put the code in side a html div block by set the class to `mermaid` like: `<div class="mermaid"></div>`. If the step 2 has set a condition on the var `page.mermaid`, you need to also add a variable named `mermaid` and set its value to `true` in the post header.

The **seconde solution** is to install the gem plugin [jekyll-mermaid](https://github.com/jasonbellamy/jekyll-mermaid) where the underlying implementation uses the mermaid API too, This is what I'm using as per this [commit](https://github.com/shamshadM/shamshadM.github.io/) it's a little bitter easier than the first solution.

<hr>

# Use of Mermaid to draw different Types of diagram
<hr>

## Flowchart

All Flowcharts are composed of nodes, the geometric shapes and edges, the arrows or lines. The mermaid code defines the way that these nodes and edges are made and interact.

It can also accommodate different arrow types, multi directional arrows, and linking to and from subgraphs.

 <div class="mermaid">
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
</div>

 <div class="mermaid">
flowchart LR
A[Hard] -->|Text| B(Round)
B --> C{Decision}
C -->|One| D[Result 1]
C -->|Two| E[Result 2]
 </div >

## Pie chart Diagrams
A pie chart (or a circle chart) is a circular statistical graphic, which is divided into slices to illustrate numerical proportion. In a pie chart, the arc length of each slice (and consequently its central angle and area), is proportional to the quantity it represents. While it is named for its resemblance to a pie which has been sliced, there are variations on the way it can be presented. The earliest known pie chart is generally credited to William Playfair's Statistical Breviary of 1801 -Wikipedia

  <div class="mermaid">
pie showData
    title Key elements in Product X
    "Calcium" : 42.96
    "Potassium" : 50.05
    "Magnesium" : 10.01
    "Iron" :  5
  </div >

## Sequence Diagram
A sequence diagram or system sequence diagram (SSD) shows process interactions arranged in time sequence in the field of software engineering. It depicts the processes involved and the sequence of messages exchanged between the processes needed to carry out the functionality. Sequence diagrams are typically associated with use case realizations in the 4+1 architectural view model of the system under development. Sequence diagrams are sometimes called event diagrams or event scenarios.

  <div class="mermaid">
    sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!
  </div >

## Gantt Diagram 
 
 A Gantt chart is a type of bar chart that illustrates a project schedule. This chart lists the tasks to be performed on the vertical axis, and time intervals on the horizontal axis. The width of the horizontal bars in the graph shows the duration of each activity. Gantt charts illustrate the start and finish dates of the terminal elements and summary elements of a project. Terminal elements and summary elements constitute the work breakdown structure of the project. Modern Gantt charts also show the dependency (i.e., precedence network) relationships between activities. Gantt charts can be used to show current schedule status using percent-complete shadings and a vertical "TODAY" line.

 <div class="mermaid">
gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    First Task       :a1, 2018-07-01, 30d
    Another Task     :after a1, 20d
    section Another
    Second Task      :2018-07-12, 12d
    Third Task       : 24d
 </div >

## Class Diagram 
In software engineering, a <b>class diagram</b> in the Unified Modeling Language (UML) is a type of static structure diagram that describes the structure of a system by showing the system's classes, their attributes, operations (or methods), and the relationships among objects.

The class diagram is the main building block of object-oriented modeling. It is used for general conceptual modeling of the structure of the application, and for detailed modeling, translating the models into programming code. Class diagrams can also be used for data modeling. The classes in a class diagram represent both the main elements, interactions in the application, and the classes to be programmed.

 <div class="mermaid">
classDiagram
Class01 <|-- AveryLongClass : Cool
Class03 *-- Class04
Class05 o-- Class06
Class07 .. Class08
Class09 --> C2 : Where am i?
Class09 --* C3
Class09 --|> Class07
Class07 : equals()
Class07 : Object[] elementData
Class01 : size()
Class01 : int chimp
Class01 : int gorilla
Class08 <--> C2: Cool label
  </div >

## Git Graph
The collection of all commits in a repository forms what in mathematics is called a graph: visually, a set of objects with lines drawn between some pairs of them. In Git, the lines represent the commit parent relationship previously explained, and this structure is called the “commit graph” of the repository

  <div class="mermaid">
gitGraph
   commit
   commit
   branch develop
   commit
   commit
   commit
   checkout main
   commit
   commit
   </div >

## State Diagram
A state diagram is a type of diagram used in computer science and related fields to describe the behavior of systems. State diagrams require that the system described is composed of a finite number of states; sometimes, this is indeed the case, while at other times this is a reasonable abstraction. Many forms of state diagrams exist, which differ slightly and have different semantics.

 <div class="mermaid">
stateDiagram-v2
[*] --> Still
Still --> [*]
Still --> Moving
Moving --> Still
Moving --> Crash
Crash --> [*]
  </div >

## User Journey Diagram
User journeys describe at a high level of detail exactly what steps different users take to complete a specific task within a system, application or website. This technique shows the current (as-is) user workflow, and reveals areas of improvement for the to-be workflow. (Wikipedia)

 <div class="mermaid">
  journey
    title My working day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat
    section Go home
      Go downstairs: 5: Me
      Sit down: 3: Me
 </div >

## ER Diagram 
An entity–relationship model (or ER model) describes interrelated things of interest in a specific domain of knowledge. A basic ER model is composed of entity types (which classify the things of interest) and specifies relationships that can exist between entities (instances of those entity types). Wikipedia.

 <div class="mermaid">
 erDiagram
          CUSTOMER }|..|{ DELIVERY-ADDRESS : has
          CUSTOMER ||--o{ ORDER : places
          CUSTOMER ||--o{ INVOICE : "liable for"
          DELIVERY-ADDRESS ||--o{ ORDER : receives
          INVOICE ||--|{ ORDER : covers
          ORDER ||--|{ ORDER-ITEM : includes
          PRODUCT-CATEGORY ||--|{ PRODUCT : contains
          PRODUCT ||--o{ ORDER-ITEM : "ordered in"
 </div >

Mermaid is the best packages to draw the graphs, flowcharts, tables etc. You can find more about the mermaid on [Mermaid](https://mermaid-js.github.io/mermaid/#/)
happy to see plugin mermaid :+1:!