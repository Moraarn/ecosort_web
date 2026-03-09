export const animations = {
  trashThrowing: [
    '/animations/trash-throw-1.gif',
    '/animations/trash-throw-2.gif',
    '/animations/trash-throw-3.gif'
  ],
  recycling: [
    '/animations/recycling-1.gif',
    '/animations/recycling-2.gif'
  ],
  success: [
    '/animations/success-1.gif',
    '/animations/success-2.gif'
  ]
}

export const getRandomAnimation = (type: keyof typeof animations): string => {
  const animationArray = animations[type]
  return animationArray[Math.floor(Math.random() * animationArray.length)]
}
