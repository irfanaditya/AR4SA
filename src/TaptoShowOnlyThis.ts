// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'tapToShowOnlyThis',

  stateMachine: ({world, eid}) => {
    const showOnlyThisObject = () => {
      const parent = world.getParent(eid)
      const siblings = Array.from(world.getChildren(parent))

      siblings.forEach((siblingEid) => {
        if (siblingEid === eid) {
          ecs.Hidden.remove(world, siblingEid)
        } else {
          ecs.Hidden.set(world, siblingEid)
        }
      })
    }

    ecs.defineState('default').initial()
      .onEvent(ecs.input.SCREEN_TOUCH_START, 'touched', {
        target: eid,
      })

    ecs.defineState('touched')
      .onEnter(() => {
        console.log('show only tapped object')
        showOnlyThisObject()
      })
      .onEvent(ecs.input.SCREEN_TOUCH_END, 'default', {
        target: eid,
      })
  },
})
