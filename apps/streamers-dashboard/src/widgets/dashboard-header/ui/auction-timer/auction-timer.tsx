import { Button } from 'klewik-ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from 'klewik-ui/dialog'
import { Divider } from 'klewik-ui/divider'
import { Flex } from 'klewik-ui/flex'
import { Icons } from 'klewik-ui/icons'
import { MotionBox } from 'klewik-ui/motion-box'
import {
  Timer,
  TimerDecreaseButton,
  TimerIncreaseButton,
  TimerStartButton,
  TimerStopButton,
  TimerValue,
  useTimer,
} from 'klewik-ui/timer'
import { Typography } from 'klewik-ui/typography'

import { cn } from '~shared/utils'

type AuctionTimerProps = {
  className?: string
}

export const AuctionTimer = (props: AuctionTimerProps) => {
  const timer = useTimer({ initTime: 3600, immediately: false })

  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ width: 0, opacity: 0, scale: 0 }}
    >
      <Timer timer={timer}>
        <Flex
          className={cn(
            'w-full rounded-md bg-dark px-2 h-9',
            props.className,
          )}
          justify="center"
          align="center"
        >
          <Flex className="gap-x-4">
            <Flex className="h-9 gap-x-1.5" align="center">
              <Icons.Timer className="text-gray-light" size="xs" />
              <TimerValue />
            </Flex>
            <Flex className="text-gray-light" align="center">
              <TimerStartButton className="size-7" size="xs" />
              <TimerStopButton className="size-7" size="xs" />
              <TimerIncreaseButton
                className="stroke-[0.75px] stroke-current size-7"
                addingValue={10}
                size="xs"
              />
              <TimerDecreaseButton
                className="stroke-[0.75px] stroke-current size-7"
                decreaseValue={10}
                size="xs"
              />
            </Flex>
          </Flex>

          <Divider className="border-gray h-4 mx-2" orientation="vertical" />

          <Dialog>
            <DialogTrigger>
              <Button
                className="text-gray-light px-2 size-7 hover:text-gray-accent stroke-[0.75px] stroke-current"
                variant="ghost"
                isIconOnly
                size="xs"
                icon={(
                  <Icons.OpenArrow
                    size="xs"
                  />
                )}
              />
            </DialogTrigger>
            <DialogContent
              className="p-0 min-w-1/3 max-w-fit border-1 rounded-[20px] border-dark-light gap-0 overflow-clip"
            >
              <DialogTitle className="px-6 py-3">
                <Flex className="gap-x-1.5 text-gray-accent" align="center">
                  <Icons.Timer size="sm" />
                  <Typography tag="h4">Таймер</Typography>
                </Flex>
              </DialogTitle>
              <div className="relative w-full">
                <Divider className="absolute w-full" />
              </div>
              <Flex className="w-full gap-y-2 px-6 pb-6" align="center" direction="column">
                <TimerValue className="text-[clamp(6.5rem,10vw,8rem)] text-gray-accent font-golos-f" />
                <Flex className="text-gray-light gap-x-6" align="center">
                  <TimerStartButton
                    icon={
                      timer.status === 'ticking'
                        ? <Icons.Pause width={46} height={46} />
                        : <Icons.Play width={46} height={46} />
                    }
                    size="lg"
                  />
                  <TimerStopButton icon={<Icons.Stop width={46} height={46} />} size="lg" />
                  <TimerIncreaseButton
                    className="stroke-[0.75px] stroke-current"
                    addingValue={10}
                    size="lg"
                    icon={<Icons.Plus width={52} height={52} />}
                  />
                  <TimerDecreaseButton
                    className="stroke-[0.75px] stroke-current"
                    decreaseValue={10}
                    size="lg"
                    icon={<Icons.Minus width={52} height={52} />}
                  />
                </Flex>
              </Flex>
            </DialogContent>
          </Dialog>
        </Flex>
      </Timer>
    </MotionBox>
  )
}
