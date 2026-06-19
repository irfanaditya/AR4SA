// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'TapToShow',

  stateMachine: ({world, eid}) => {
    let panelShown = false

    const getAllChildrenRecursive = (parentEid) => {
      const children = Array.from(world.getChildren(parentEid))
      let allChildren = [...children]

      children.forEach((childEid) => {
        allChildren = allChildren.concat(getAllChildrenRecursive(childEid))
      })

      return allChildren
    }

    const togglePanel = () => {
      const allChildren = getAllChildrenRecursive(eid)

      allChildren.forEach((childEid) => {
        if (panelShown) {
          ecs.Hidden.set(world, childEid)
        } else {
          ecs.Hidden.remove(world, childEid)
        }
      })

      panelShown = !panelShown
    }

    ecs.defineState('default').initial()
      .onEvent(ecs.input.SCREEN_TOUCH_START, 'touched', {
        target: eid,
      })

    ecs.defineState('touched')
      .onEnter(() => {
        togglePanel()
      })
      .onEvent(ecs.input.SCREEN_TOUCH_END, 'default', {
        target: eid,
      })
  },
})
