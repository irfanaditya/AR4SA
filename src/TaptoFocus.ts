// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'TapToFocus',

  stateMachine: ({world, eid}) => {
    const children = Array.from(world.getChildren(eid))
    const descriptionUI = children[0]

    let isFocused = false

    const focusThisObject = () => {
      const parent = world.getParent(eid)
      const siblings = Array.from(world.getChildren(parent))

      if (!isFocused) {
        // tampilkan hanya object yang di-tap
        siblings.forEach((siblingEid) => {
          if (siblingEid === eid) {
            ecs.Hidden.remove(world, siblingEid)

            // tampilkan UI deskripsi di bawah object ini
            if (descriptionUI) {
              ecs.Hidden.remove(world, descriptionUI)
            }
          } else {
            ecs.Hidden.set(world, siblingEid)
          }
        })

        isFocused = true
      } else {
        // kembalikan semua object seperti default
        siblings.forEach((siblingEid) => {
          ecs.Hidden.remove(world, siblingEid)

          // sembunyikan kembali UI deskripsi setiap object
          const siblingChildren = Array.from(world.getChildren(siblingEid))
          const siblingDescriptionUI = siblingChildren[0]

          if (siblingDescriptionUI) {
            ecs.Hidden.set(world, siblingDescriptionUI)
          }
        })

        isFocused = false
      }
    }

    ecs.defineState('default').initial()
      .onEvent(ecs.input.SCREEN_TOUCH_START, 'touched', {
        target: eid,
      })

    ecs.defineState('touched')
      .onEnter(() => {
        focusThisObject()
      })
      .onEvent(ecs.input.SCREEN_TOUCH_END, 'default', {
        target: eid,
      })
  },
})
