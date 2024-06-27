enum ActionKind {
    Walking,
    Idle,
    Jumping
}
namespace SpriteKind {
    export const NextPosition = SpriteKind.create()
    export const Car = SpriteKind.create()
    export const Log = SpriteKind.create()
    export const Lava = SpriteKind.create()
    export const EmptyNest = SpriteKind.create()
    export const FilledNest = SpriteKind.create()
    export const Waterfall = SpriteKind.create()
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (levelStarted && playerIsAlive) {
        direction = 0
        movePlayer()
    }
})
function checkPlayerOnLog () {
    if (!(isOnLog)) {
        for (let value of sprites.allOfKind(SpriteKind.Log)) {
            if (frogging.overlapsWith(value)) {
                isOnLog = true
                // set speed to log
                nextPlayerPosition.vx = value.vx
                frogging.vx = value.vx
            }
        }
    }
}
function setInitialVariables () {
    timeBeforeGettingNest = 0
    timeRemainingAfterGettingNest = 0
    waterfallImage = img`
        6 6 6 6 6 6 6 9 6 6 6 6 6 6 6 6 
        6 6 6 6 6 6 6 6 6 6 6 9 6 6 6 6 
        6 6 6 9 6 6 6 6 6 6 6 6 6 6 6 6 
        6 6 6 6 6 6 6 6 6 6 6 6 6 6 9 6 
        6 6 6 6 6 6 9 6 6 6 9 6 6 6 6 6 
        6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
        6 6 9 6 6 6 6 6 6 6 6 6 6 6 6 6 
        6 6 6 6 6 6 6 6 9 6 6 6 6 6 6 6 
        6 6 6 6 6 6 6 6 6 6 6 6 9 6 6 6 
        6 6 6 6 9 6 6 6 6 6 6 6 6 6 6 6 
        6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
        6 6 6 6 6 6 6 9 6 6 6 6 6 6 6 6 
        6 6 9 6 6 6 6 6 6 6 6 9 6 6 6 6 
        6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
        6 6 6 6 6 6 6 6 6 9 6 6 6 6 9 6 
        6 6 6 6 9 6 6 6 6 6 6 6 6 6 6 6 
        `
    lavaImage = img`
        5 4 4 5 5 4 4 4 4 2 2 2 4 4 4 4 
        4 4 4 4 4 5 5 4 2 2 2 2 4 4 4 5 
        4 2 2 2 4 4 5 4 2 2 4 4 5 5 5 5 
        2 2 4 2 4 4 5 4 2 2 4 5 5 5 5 4 
        2 2 2 2 4 4 5 4 2 2 4 4 5 5 4 4 
        4 2 2 2 4 5 5 4 4 4 4 4 4 4 4 2 
        2 2 2 4 4 5 5 5 4 4 2 2 2 2 2 2 
        4 2 2 4 5 5 5 5 4 2 2 4 2 2 2 4 
        5 4 4 4 4 4 4 5 5 4 2 2 2 4 4 4 
        4 4 4 2 2 2 4 4 5 5 4 4 4 4 5 5 
        4 2 2 2 2 2 2 2 4 5 5 5 5 5 5 5 
        5 4 4 2 4 2 2 4 4 5 5 5 4 4 4 5 
        5 5 4 2 2 2 4 4 4 5 5 4 2 2 2 4 
        4 5 4 4 4 4 5 5 5 5 4 2 4 2 2 4 
        4 5 5 5 5 5 5 4 4 4 2 4 2 4 2 4 
        4 5 5 5 4 4 4 4 2 2 2 2 4 2 4 4 
        `
    froggingSpeed = 60
    movementXY = 16
    levelStarted = false
    isMoving = false
    overLand = true
    totalLogRows = 5
    totalCarRows = 5
    logsStartAtRow = 2
    logsFinishAtRow = 6
    carsStartAtRow = 8
    dataRow = "rowNumber"
    dataSpriteSpeed = "aSpriteSpeed"
    dataNestColumn = "aNestColumn"
    minSpeed = 30
    maxSpeed = 70
    level = 1
    startingLives = 5
    nestsStartAtColumn = 2
    nestsAreInRow = 1
    info.setLife(startingLives)
    countdownToStart = 2
    countdownPlaying = 60
    nestLandingPositionX = 0
    nestMarginOfErrorX = 2.5
    lifeGreetings = [
    "Last Chance!",
    "Don't Let This Be a DNF",
    "Do You Need a PAF",
    "Maybe Try a Different TOTT",
    "Good luck"
    ]
    scorePerVerticalStep = 10
    scorePerNest = 50
    scoreAllNests = 1000
    scorePerRemainingSeconds = 10
    playerIsAlive = true
}
function checkPlayerHitANest () {
    landedOnANest = false
    for (let anEmptyNest of sprites.allOfKind(SpriteKind.EmptyNest)) {
        if (!(landedOnANest)) {
            if (frogging.overlapsWith(anEmptyNest)) {
                landedOnANest = true
                aLandedNest = anEmptyNest
            }
        }
    }
    for (let aFilledNest of sprites.allOfKind(SpriteKind.FilledNest)) {
        if (playerIsAlive) {
            if (frogging.overlapsWith(aFilledNest)) {
                playerLosesLife()
            }
        }
    }
    if (playerIsAlive) {
        if (landedOnANest) {
            nestLandingPositionX = Math.abs(frogging.x - aLandedNest.x)
            if (nestLandingPositionX <= nestMarginOfErrorX) {
                playerLandedOnANest(aLandedNest)
            } else {
                playerLosesLife()
            }
        } else {
            playerLosesLife()
        }
    }
}
function setPlayer () {
    frogging = sprites.create(froggingImage, SpriteKind.Player)
    frogging.z = 1
    frogging.setFlag(SpriteFlag.StayInScreen, true)
    scene.cameraFollowSprite(frogging)
    controller.moveSprite(frogging, 0, 0)
    nextPlayerPosition = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . 2 . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . 2 . . . 2 . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . 2 . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.NextPosition)
    nextPlayerPosition.setFlag(SpriteFlag.StayInScreen, true)
    placePlayerAtStart()
}
// logPropertySets [0 = log length; 1 = minimum spacing; 2 = maximum spacing, 3 = speed, 4 = log image]
function setLogs () {
    let logPropertySets: number[][] = []
    logPropertySets.push([
    4,
    3,
    4,
    20,
    1
    ])
    logPropertySets.push([
    2,
    2,
    3,
    -25,
    0
    ])
    logPropertySets.push([
    5,
    4,
    6,
    30,
    1
    ])
    logPropertySets.push([
    3,
    2,
    3,
    20,
    1
    ])
    logPropertySets.push([
    3,
    2,
    2,
    -25,
    0
    ])
    logImages = [img`
        . . . . . . . . . . . . . . . . 
        . . . . 6 . . . . . . 6 6 . . . 
        . . . 6 . . . . . . 6 6 . . . . 
        . . . 6 6 2 2 2 2 2 6 . . . . . 
        . . . . 2 2 2 2 2 2 2 . . . . . 
        . . 2 2 2 2 4 2 2 2 2 2 2 . . . 
        . f 2 2 2 2 2 2 2 4 2 2 2 . . . 
        . 2 2 2 2 2 2 2 2 2 2 2 6 6 . . 
        . f 2 2 4 2 2 2 2 2 2 2 2 . . . 
        . . 2 2 2 2 2 2 2 4 2 2 2 . . . 
        . . . . 2 2 2 2 2 2 2 . . . . . 
        . . . 6 6 2 2 2 2 2 6 . . . . . 
        . . . 6 . . . . . . 6 6 . . . . 
        . . . . 6 . . . . . . 6 6 . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . 6 6 . . . . . . . . . . 6 6 . 
        e 6 e e e e e e e e e e e e 6 e 
        6 6 e e e e e e d e e e e e 6 6 
        e e e e e e e e e e e e e e e e 
        e e e d e e e e e e e e e d e e 
        e e e e e e e e e e e e e e e e 
        e e e e e e e d e e e e e e e e 
        6 6 e e e e e e e e e e e e 6 6 
        e 6 e e e e e e e e e e e e 6 e 
        . 6 6 . . . . . . . . . . 6 6 . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `]
    for (let logPropertySetIndex = 0; logPropertySetIndex <= logPropertySets.length - 1; logPropertySetIndex++) {
        aLogPropertySet = logPropertySets[logPropertySetIndex]
        logLength = aLogPropertySet[0]
        spacingMinimum = aLogPropertySet[1]
        spacingMaximum = aLogPropertySet[2]
        aSpriteSpeed = aLogPropertySet[3]
        logImageIndex = aLogPropertySet[4]
        spriteSpacing = randint(spacingMinimum, spacingMaximum)
        tileRowNumber = logsStartAtRow + logPropertySetIndex
        columnStart = randint(0, spriteSpacing)
        tileColumnNumber = columnStart
        spriteColumn = 0
        anImage = logImages[logImageIndex]
        while (tileColumnNumber + spriteSpacing / 2 < totalColumns) {
            for (let index = 0; index < logLength; index++) {
                if (tileColumnNumber < totalColumns) {
                    aSprite322 = sprites.create(anImage, SpriteKind.Log)
                    if (aSpriteSpeed > 0) {
                        transformSprites.rotateSprite(aSprite322, 180)
                    }
                    aSprite322.z = 0
                    sprites.setDataNumber(aSprite322, dataSpriteSpeed, aSpriteSpeed)
                    sprites.setDataNumber(aSprite322, dataRow, tileRowNumber)
                    grid.place(aSprite322, tiles.getTileLocation(tileColumnNumber, tileRowNumber))
                    tileColumnNumber += 1
                }
            }
            tileColumnNumber += spriteSpacing
        }
    }
}
// carPropertySet [0 = total cars; 1 = minimum spacing; 2 = maximum spacing, 3 = speed]
function setCars () {
    let carPropertySets: number[][] = []
    carImagesLeft = [
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . 6 6 6 6 6 6 6 6 . . 
        . . . . . 6 c 6 6 6 6 6 6 4 6 . 
        . . . . 6 c c 6 6 6 6 6 6 4 c 6 
        . . d 6 4 c c 6 4 4 4 4 4 4 c c 
        . d 6 6 4 c b a a a a a a a 6 c 
        . 6 6 6 4 b a a b b b a b b e 6 
        . 6 6 6 6 6 a b b b b a b b b a 
        . 6 6 6 6 a 6 6 6 6 6 a 6 6 6 a 
        . 6 d d 6 a f a a a f a a a 6 a 
        . d d 6 a a a f a a f a a a a a 
        . a a a a a a a f f f a a a a a 
        . a a a a f f f a a a a f f f f 
        . . . a f f f f f a a f f f f f 
        . . . . f f f f . . . . f f f . 
        . . . . . . . . . . . . . . . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . 7 7 7 7 7 7 7 7 . . 
        . . . . . 7 c 7 7 7 7 7 7 d 7 . 
        . . . . 7 c c 7 7 7 7 7 7 d c 7 
        . . d 7 d c c 7 d d d d d d c c 
        . d 7 7 d c b 4 4 4 4 4 4 4 7 c 
        . 7 7 7 d b 4 4 b b b 4 b b a 7 
        . 7 7 7 7 7 4 b b b b 4 b b b 4 
        . 7 7 7 7 4 7 7 7 7 7 4 7 7 7 4 
        . 7 d d 7 4 f 4 4 4 f 4 4 4 4 4 
        . d d 3 4 4 4 f 4 4 f 4 4 4 4 4 
        . 4 4 4 4 4 4 4 f f f 4 4 4 4 4 
        . 4 4 4 4 f f f 4 4 4 4 f f f f 
        . . . 4 f f f f f 4 4 f f f f f 
        . . . . f f f f . . . . f f f . 
        . . . . . . . . . . . . . . . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . 3 3 3 3 3 3 3 3 . . 
        . . . . . 3 c 3 3 3 3 3 3 d 3 . 
        . . . . 3 c c 3 3 3 3 3 3 d c 3 
        . . d 3 d c c 3 d d d d d d c c 
        . d 3 3 d c b a a a a a a a 3 c 
        . 3 3 3 d b a a b b b a b b a 3 
        . 3 3 3 3 3 a b b b b a b b b a 
        . 3 3 3 3 a 3 3 3 3 3 a 3 3 3 a 
        . 3 d d 3 a f a a a f a a a a a 
        . d d 3 a a a f a a f a a a a a 
        . a a a a a a a f f f a a a a a 
        . a a a a f f f a a a a f f f f 
        . . . a f f f f f a a f f f f f 
        . . . . f f f f . . . . f f f . 
        . . . . . . . . . . . . . . . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . 6 6 6 6 6 6 6 6 . . 
        . . . . . 6 c 6 6 6 6 6 6 9 6 . 
        . . . . 6 c c 6 6 6 6 6 6 9 c 6 
        . . d 6 9 c c 6 9 9 9 9 9 9 c c 
        . d 6 6 9 c b 8 8 8 8 8 8 8 6 c 
        . 6 6 6 9 b 8 8 b b b 8 b b 8 6 
        . 6 6 6 6 6 8 b b b b 8 b b b 8 
        . 6 6 6 6 8 6 6 6 6 6 8 6 6 6 8 
        . 6 d d 6 8 f 8 8 8 f 8 8 8 8 8 
        . d d 6 8 8 8 f 8 8 f 8 8 8 8 8 
        . 8 8 8 8 8 8 8 f f f 8 8 8 8 8 
        . 8 8 8 8 f f f 8 8 8 8 f f f f 
        . . . 8 f f f f f 8 8 f f f f f 
        . . . . f f f f . . . . f f f . 
        . . . . . . . . . . . . . . . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . 2 2 2 2 2 2 2 2 . . 
        . . . . . 2 c 2 2 2 2 2 2 4 2 . 
        . . . . 2 c c 2 2 2 2 2 2 4 c 2 
        . . d 2 4 c c 2 4 4 4 4 4 4 c c 
        . d 2 2 4 c b e e e e e e e 2 c 
        . 2 2 2 4 b e e b b b e b b e 2 
        . 2 2 2 2 2 e b b b b e b b b e 
        . 2 2 2 2 e 2 2 2 2 2 e 2 2 2 e 
        . 2 d d 2 e f e e e f e e e 1 e 
        . d d 2 e e e f e e f e e e e e 
        . e e e e e e e f f f e e e e e 
        . e e e e f f f e e e e f f f f 
        . . . e f f f f f e e f f f f f 
        . . . . f f f f . . . . f f f . 
        . . . . . . . . . . . . . . . . 
        `
    ]
    carImagesRight = [
    img`
        . . . . . . . . . . . . . . . . 
        . . . . 6 6 6 6 6 6 6 6 . . . . 
        . . . 6 4 6 6 6 6 6 6 c 6 . . . 
        . . 6 c 4 6 6 6 6 6 6 c c 6 . . 
        . 6 c c 4 4 4 4 4 4 6 c c 4 6 d 
        . 6 c 6 a a a a a a a b c 4 6 6 
        . 6 6 a b b a b b b a a b 4 6 6 
        . 6 a b b b a b b b b a 6 6 6 6 
        . a a 6 6 6 a 6 6 6 6 6 a 6 6 6 
        . a a a a a a f a a a f a 6 d d 
        . a a a a a a f a a f a a a 6 d 
        . a a a a a a f f f a a a a a a 
        . a f f f f a a a a f f f a a a 
        . . f f f f f a a f f f f f a . 
        . . . f f f . . . . f f f f . . 
        . . . . . . . . . . . . . . . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . 7 7 7 7 7 7 7 7 . . . . 
        . . . 7 4 7 7 7 7 7 7 c 7 . . . 
        . . 7 c 4 7 7 7 7 7 7 c c 7 . . 
        . 7 c c 4 4 4 4 4 4 7 c c 4 7 d 
        . 7 c 7 4 4 4 4 4 4 4 b c 4 7 7 
        . 7 7 e b b 4 b b b 4 4 b 4 7 7 
        . 7 4 b b b 4 b b b b 4 7 7 7 7 
        . 4 4 7 7 7 4 7 7 7 7 7 4 7 7 7 
        . 4 4 4 4 4 4 f 4 4 4 f 4 7 d d 
        . 4 4 4 4 4 4 f 4 4 f 4 4 4 7 d 
        . 4 4 4 4 4 4 f f f 4 4 4 4 4 4 
        . 4 f f f f 4 4 4 4 f f f 4 4 4 
        . . f f f f f 4 4 f f f f f 4 . 
        . . . f f f . . . . f f f f . . 
        . . . . . . . . . . . . . . . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . 3 3 3 3 3 3 3 3 . . . . 
        . . . 3 d 3 3 3 3 3 3 c 3 . . . 
        . . 3 c d 3 3 3 3 3 3 c c 3 . . 
        . 3 c c d d d d d d 3 c c d 3 d 
        . 3 c 3 a a a a a a a b c d 3 3 
        . 3 3 a b b a b b b a a b d 3 3 
        . 3 a b b b a b b b b a 3 3 3 3 
        . a a 3 3 3 a 3 3 3 3 3 a 3 3 3 
        . a a a a a a f a a a f a 3 d d 
        . a a a a a a f a a f a a a 3 d 
        . a a a a a a f f f a a a a a a 
        . a f f f f a a a a f f f a a a 
        . . f f f f f a a f f f f f a . 
        . . . f f f . . . . f f f f . . 
        . . . . . . . . . . . . . . . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . 6 6 6 6 6 6 6 6 . . . . 
        . . . 6 9 6 6 6 6 6 6 c 6 . . . 
        . . 6 c 9 6 6 6 6 6 6 c c 6 . . 
        . 6 c c 9 9 9 9 9 9 6 c c 9 6 d 
        . 6 c 6 8 8 8 8 8 8 8 b c 9 6 6 
        . 6 6 8 b b 8 b b b 8 8 b 9 6 6 
        . 6 8 b b b 8 b b b b 8 6 6 6 6 
        . 8 8 6 6 6 8 6 6 6 6 6 8 6 6 6 
        . 8 8 8 8 8 8 f 8 8 8 f 8 6 d d 
        . 8 8 8 8 8 8 f 8 8 f 8 8 8 6 d 
        . 8 8 8 8 8 8 f f f 8 8 8 8 8 8 
        . 8 f f f f 8 8 8 8 f f f 8 8 8 
        . . f f f f f 8 8 f f f f f 8 . 
        . . . f f f . . . . f f f f . . 
        . . . . . . . . . . . . . . . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . 2 2 2 2 2 2 2 2 . . . . 
        . . . 2 4 2 2 2 2 2 2 c 2 . . . 
        . . 2 c 4 2 2 2 2 2 2 c c 2 . . 
        . 2 c c 4 4 4 4 4 4 2 c c 4 2 d 
        . 2 c 2 e e e e e e e b c 4 2 2 
        . 2 2 e b b e b b b e e b 4 2 2 
        . 2 e b b b e b b b b e 2 2 2 2 
        . e e 2 2 2 e 2 2 2 2 2 e 2 2 2 
        . e e e e e e f e e e f e 2 d d 
        . e e e e e e f e e f e e e 2 d 
        . e e e e e e f f f e e e e e e 
        . e f f f f e e e e f f f e e e 
        . . f f f f f e e f f f f f e . 
        . . . f f f . . . . f f f f . . 
        . . . . . . . . . . . . . . . . 
        `
    ]
    carPropertySets.push([
    1,
    3,
    5,
    -20
    ])
    carPropertySets.push([
    1,
    3,
    4,
    25
    ])
    carPropertySets.push([
    1,
    3,
    5,
    -20
    ])
    carPropertySets.push([
    1,
    4,
    7,
    25
    ])
    carPropertySets.push([
    1,
    3,
    4,
    -20
    ])
    for (let carPropertySetIndex = 0; carPropertySetIndex <= carPropertySets.length - 1; carPropertySetIndex++) {
        aSpritePropertySet = carPropertySets[carPropertySetIndex]
        carsInRowTotal = aSpritePropertySet[0]
        spacingMinimum = aSpritePropertySet[1]
        spacingMaximum = aSpritePropertySet[2]
        aSpriteSpeed = aSpritePropertySet[3]
        spriteSpacing = randint(spacingMinimum, spacingMaximum)
        tileRowNumber = carsStartAtRow + carPropertySetIndex
        columnStart = randint(0, spriteSpacing)
        tileColumnNumber = columnStart
        spriteColumn = 0
        anImage = carImagesLeft[carPropertySetIndex]
        while (spriteColumn < totalColumns) {
            aSprite322 = sprites.create(anImage, SpriteKind.Car)
            aSprite322.z = 2
            sprites.setDataNumber(aSprite322, dataSpriteSpeed, aSpriteSpeed)
            sprites.setDataNumber(aSprite322, dataRow, tileRowNumber)
            grid.place(aSprite322, tiles.getTileLocation(tileColumnNumber, tileRowNumber))
            if (aSpriteSpeed > 0) {
                aSprite322.setImage(carImagesRight[carPropertySetIndex])
            }
            spriteColumn += spriteSpacing + carsInRowTotal
            tileColumnNumber = spriteColumn
        }
    }
}
// move by  setting the xy location of nextPlayerPosition and have player follow Direction (clockwise) [North, East, South, West] [0 = up; 1 = right; 2 = down; 3 = left]
function moveUsingXY () {
    if (direction == 0) {
        transformSprites.rotateSprite(frogging, 0)
        nextPlayerPosition.setPosition(frogging.x, frogging.y - movementXY)
        scoreMovingUp(nextPlayerPosition)
    } else if (direction == 1) {
        transformSprites.rotateSprite(frogging, 90)
        nextPlayerPosition.setPosition(frogging.x + movementXY, frogging.y)
    } else if (direction == 2) {
        transformSprites.rotateSprite(frogging, 180)
        nextPlayerPosition.setPosition(frogging.x, frogging.y + movementXY)
    } else {
        transformSprites.rotateSprite(frogging, 270)
        nextPlayerPosition.setPosition(frogging.x - movementXY, frogging.y)
    }
    music.playTone(988, BeatFraction.Sixteenth)
    frogging.follow(nextPlayerPosition, froggingSpeed)
}
function setEdgeTiles () {
    tileColumnNumber = 0
    for (let index = 0; index < 2; index++) {
        tileRowNumber = 1
        for (let index22 = 0; index22 <= totalLogRows; index22++) {
            aWaterfallSprite = sprites.create(img`
                6 6 6 6 6 6 6 9 6 6 6 6 6 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 9 6 6 6 6 
                6 6 6 9 6 6 6 6 6 6 6 6 6 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 6 6 6 9 6 
                6 6 6 6 6 6 9 6 6 6 9 6 6 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
                6 6 9 6 6 6 6 6 6 6 6 6 6 6 6 6 
                6 6 6 6 6 6 6 6 9 6 6 6 6 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 6 9 6 6 6 
                6 6 6 6 9 6 6 6 6 6 6 6 6 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
                6 6 6 6 6 6 6 9 6 6 6 6 6 6 6 6 
                6 6 9 6 6 6 6 6 6 6 6 9 6 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
                6 6 6 6 6 6 6 6 6 9 6 6 6 6 9 6 
                6 6 6 6 9 6 6 6 6 6 6 6 6 6 6 6 
                `, SpriteKind.Waterfall)
            grid.place(aWaterfallSprite, tiles.getTileLocation(tileColumnNumber, tileRowNumber + index22))
            aWaterfallSprite.z = 0
        }
        tileColumnNumber = totalColumns - 1
    }
    tileColumnNumber = 0
    for (let index = 0; index < 2; index++) {
        tileRowNumber = carsStartAtRow
        for (let index23 = 0; index23 <= totalCarRows; index23++) {
            aLavaSprite = sprites.create(lavaImage, SpriteKind.Lava)
            grid.place(aLavaSprite, tiles.getTileLocation(tileColumnNumber, tileRowNumber + index23))
            aLavaSprite.z = 0
        }
        tileColumnNumber = totalColumns - 1
    }
}
scene.onHitWall(SpriteKind.Car, function (sprite, location) {
    spritesHittingWall.push(sprite)
})
function playerLandedOnANest (aLandedNest: Sprite) {
    aNestColumn = sprites.readDataNumber(aLandedNest, dataNestColumn)
    nestColumns[aNestColumn] = 1
    aLandedNest.setImage(froggingLoverImage)
    aLandedNest.setKind(SpriteKind.FilledNest)
    info.player1.changeScoreBy(scorePerNest)
    timeRemainingAfterGettingNest = game.runtime() - timeBeforeGettingNest
    scoreForRemainingTime = timeRemainingAfterGettingNest / 1000 * scorePerRemainingSeconds
    filledNestValue = 0
    for (let nestColumnIndex = 0; nestColumnIndex <= nestColumns.length - 1; nestColumnIndex++) {
        filledNestValue += nestColumns[nestColumnIndex]
    }
    if (filledNestValue == nestColumns.length) {
        info.player1.changeScoreBy(scoreAllNests)
        music.playMelody("D E F G A F G C5 ", 300)
        allNestsFilled = true
    } else {
        music.powerUp.playUntilDone()
    }
    if (allNestsFilled) {
        clearFilledNests()
        game.showLongText("Geocache Coordinates: NXX XX.XXX WXX XX.XXX Keep Playing for a High Score!", DialogLayout.Center)
    }
    placePlayerAtStart()
}
function clearFilledNests () {
    nestColumns = [
    0,
    0,
    0,
    0,
    0
    ]
    for (let value of sprites.allOfKind(SpriteKind.FilledNest)) {
        value.setImage(emptyNestImage)
        value.setKind(SpriteKind.EmptyNest)
    }
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (levelStarted && playerIsAlive) {
        direction = 3
        movePlayer()
    }
})
function placePlayerAtStart () {
    info.stopCountdown()
    stopEnemies()
    tiles.placeOnTile(frogging, tiles.getTileLocation(totalColumns / 2, totalRows - 1))
    transformSprites.rotateSprite(frogging, 0)
    nextPlayerPosition.setPosition(frogging.x, frogging.y)
    nextPlayerPosition.z = -3
    frogging.setVelocity(0, 0)
    levelStarted = false
    isMoving = false
    overWater = false
    isOnLog = false
    landedOnANest = false
    movingTowardsNests = false
    overLand = true
    if (allNestsFilled) {
        // todo: change sprite positions and speeds
        allNestsFilled = false
    }
    setVertialStepsMade()
    setCountdownToStart()
}
function checkIfPlayerDies () {
    if (playerIsAlive) {
        for (let value2 of sprites.allOfKind(SpriteKind.Waterfall)) {
            if (playerIsAlive && overWater) {
                if (frogging.overlapsWith(value2)) {
                    playerLosesLife()
                }
            }
        }
    }
    if (playerIsAlive && overLand) {
        for (let value3 of sprites.allOfKind(SpriteKind.Lava)) {
            if (playerIsAlive) {
                if (frogging.overlapsWith(value3)) {
                    playerLosesLife()
                }
            }
        }
    }
    if (playerIsAlive && overLand) {
        for (let value4 of sprites.allOfKind(SpriteKind.Car)) {
            if (playerIsAlive) {
                if (frogging.overlapsWith(value4)) {
                    playerLosesLife()
                }
            }
        }
    }
    if (playerIsAlive) {
        if (!(isMoving) && (overWater && !(isOnLog))) {
            playerLosesLife()
        }
    }
}
info.onCountdownEnd(function () {
    if (levelStarted) {
        playerLosesLife()
    } else {
        startLevel()
    }
})
function setTileMap () {
    scene.setTileMap(img`
        f f f f f f f f f f f f f f f f f 
        9 2 a e e a e e a e e a e e a 3 9 
        9 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 9 
        9 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 9 
        9 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 9 
        9 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 9 
        9 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 9 
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        4 d d d d d d d d d d d d d d d 4 
        4 d d d d d d d d d d d d d d d 4 
        4 d d d d d d d d d d d d d d d 4 
        4 d d d d d d d d d d d d d d d 4 
        4 d d d d d d d d d d d d d d d 4 
        4 b b b b b b b b b b b b b b b 4 
        `, TileScale.Sixteen)
    scene.setTile(15, img`
        f f e e f e e e e e f e e e f f 
        e f f f f f e e f e e f f f e e 
        e f e e f f f f f e e f f e e e 
        f f e e f f e f f f f e f f e e 
        f f f f f f f f f f f f f f f f 
        f f f f f f f f f f f f f f f f 
        f f f f f f f f f f f f f f f f 
        6 6 6 6 6 6 6 6 9 6 6 6 6 6 6 6 
        6 6 6 6 6 6 6 6 6 6 6 6 9 6 6 6 
        6 6 6 6 9 6 6 6 6 6 6 6 6 6 6 6 
        6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
        6 6 6 6 6 6 6 9 6 6 6 6 6 6 6 6 
        6 6 9 6 6 6 6 6 6 6 6 9 6 6 6 6 
        6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
        6 6 6 6 6 6 6 6 6 9 6 6 6 6 9 6 
        6 6 6 6 9 6 6 6 6 6 6 6 6 6 6 6 
        `, false)
    scene.setTile(9, img`
        6 6 6 6 6 6 6 9 6 6 6 6 6 6 6 6 
        6 6 6 6 6 6 6 6 6 6 6 9 6 6 6 6 
        6 6 6 9 6 6 6 6 6 6 6 6 6 6 6 6 
        6 6 6 6 6 6 6 6 6 6 6 6 6 6 9 6 
        6 6 6 6 6 6 9 6 6 6 9 6 6 6 6 6 
        6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
        6 6 9 6 6 6 6 6 6 6 6 6 6 6 6 6 
        6 6 6 6 6 6 6 6 9 6 6 6 6 6 6 6 
        6 6 6 6 6 6 6 6 6 6 6 6 9 6 6 6 
        6 6 6 6 9 6 6 6 6 6 6 6 6 6 6 6 
        6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
        6 6 6 6 6 6 6 9 6 6 6 6 6 6 6 6 
        6 6 9 6 6 6 6 6 6 6 6 9 6 6 6 6 
        6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
        6 6 6 6 6 6 6 6 6 9 6 6 6 6 9 6 
        6 6 6 6 9 6 6 6 6 6 6 6 6 6 6 6 
        `, false)
    scene.setTile(2, img`
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        7 7 7 7 6 7 7 6 6 6 7 6 7 7 6 7 
        7 7 7 6 d 6 6 6 d d 6 d 6 d 7 6 
        7 6 7 d d d d d d d d d d d d d 
        7 6 6 d d d d d d d d d d b d d 
        7 7 6 d d d d d d d d d d d d d 
        7 7 d d d d d d d d d d d d d d 
        7 6 d d d d b b d d d d d d d d 
        7 6 d d d d b b d d d 1 d d d d 
        7 7 6 d d d d d d d d d d d d d 
        7 6 d d d d d d d d d d d d 1 d 
        7 d d d d d d d d d 1 1 d d d d 
        7 6 d d d d d d d d 1 1 d d d d 
        7 7 6 d d d d d d d d d d d d d 
        7 6 d d b d d d d d d d d d d b 
        7 6 d d d d d d d d d d d d d d 
        `, false)
    scene.setTile(14, img`
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        6 6 7 6 7 6 7 6 6 d 6 7 7 6 7 7 
        d d 6 7 7 6 7 d d d 7 6 d 6 7 6 
        d d d d d d 6 d d d d d d d 6 d 
        d d d d d d d d d d d d d d d d 
        d 1 1 d 1 d d d d d 1 d d d d d 
        d 1 1 d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d b d d d d d d d 1 d 
        d d d d d d d d d d d d d d d d 
        d d b d d d d d d d d b b d d d 
        d d d d d d d d d d d b b d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d 1 d d d d d d d d 
        d d d d d d d d d d d d d d 1 d 
        `, false)
    scene.setTile(10, img`
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        6 6 7 6 7 6 7 6 6 d 6 7 7 6 7 7 
        6 d 6 7 7 6 7 d d d 7 6 d 6 7 6 
        d d d d d d 8 8 8 8 d d d d d d 
        d d d d 6 8 8 8 8 8 8 8 d d d d 
        d d d 8 8 8 8 8 8 8 8 8 8 d d d 
        d d 8 8 8 8 8 8 8 8 8 8 8 8 d d 
        d d 8 8 8 8 8 8 8 7 8 8 6 8 d d 
        d 8 8 8 8 8 8 8 8 7 8 8 8 8 8 d 
        d 8 8 8 8 8 8 6 7 8 8 8 8 8 8 d 
        d 8 8 8 7 8 8 8 8 8 7 8 8 8 8 d 
        d 8 8 8 8 7 8 8 8 7 8 8 8 8 6 d 
        d 6 8 7 8 7 8 8 8 8 8 8 8 8 8 d 
        d 8 8 8 7 8 8 8 8 8 6 8 8 8 8 d 
        d 8 8 8 8 8 8 8 8 8 8 8 8 8 8 d 
        d 8 8 8 8 8 6 8 8 8 8 8 8 8 8 d 
        `, false)
    scene.setTile(3, img`
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        d 6 7 6 6 7 7 7 6 d 6 7 6 7 7 7 
        d d 6 6 d d 6 6 6 d d 6 d 6 7 7 
        d d d d d d d d d d d d d d 6 7 
        d d d d b d d d d d 1 1 d d 6 7 
        d d d d d d d d d d 1 1 d 6 7 7 
        1 d d d d d d d 1 d d d d d 6 7 
        d d d d d d d d d d d d d d 6 7 
        d d d d d d d d d b d d 6 7 7 7 
        d d d b b d d d d d d d d 6 7 7 
        d d d b b d d d d d d d d d 6 7 
        d d d d d d d d d d d d d d 6 7 
        d d d d d d d d d d 1 d d 6 7 7 
        d d d d d d d d d d d d d 6 6 7 
        d d d d d b d d d d d d d d d 7 
        d d d d d d d d d d d d d d 6 7 
        `, false)
    scene.setTile(4, img`
        5 4 4 5 5 4 4 4 4 2 2 2 4 4 4 4 
        4 4 4 4 4 5 5 4 2 2 2 2 4 4 4 5 
        4 2 2 2 4 4 5 4 2 2 4 4 5 5 5 5 
        2 2 4 2 4 4 5 4 2 2 4 5 5 5 5 4 
        2 2 2 2 4 4 5 4 2 2 4 4 5 5 4 4 
        4 2 2 2 4 5 5 4 4 4 4 4 4 4 4 2 
        2 2 2 4 4 5 5 5 4 4 2 2 2 2 2 2 
        4 2 2 4 5 5 5 5 4 2 2 4 2 2 2 4 
        5 4 4 4 4 4 4 5 5 4 2 2 2 4 4 4 
        4 4 4 2 2 2 4 4 5 5 4 4 4 4 5 5 
        4 2 2 2 2 2 2 2 4 5 5 5 5 5 5 5 
        5 4 4 2 4 2 2 4 4 5 5 5 4 4 4 5 
        5 5 4 2 2 2 4 4 4 5 5 4 2 2 2 4 
        4 5 4 4 4 4 5 5 5 5 4 2 4 2 2 4 
        4 5 5 5 5 5 5 4 4 4 2 4 2 4 2 4 
        4 5 5 5 4 4 4 4 2 2 2 2 4 2 4 4 
        `, false)
    scene.setTile(8, img`
        8 8 8 8 8 8 8 8 8 8 8 6 8 8 8 8 
        8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 
        8 8 8 8 8 8 8 6 8 8 8 8 8 8 8 8 
        8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 
        8 8 8 8 6 8 8 8 8 8 8 8 8 8 8 8 
        8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 
        8 6 8 8 8 8 8 8 8 8 8 8 8 8 8 8 
        8 8 8 8 8 8 8 8 8 8 8 8 6 8 8 8 
        8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 
        8 8 8 8 8 8 8 6 8 8 8 8 8 8 8 8 
        8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 
        8 8 8 8 6 8 8 8 8 8 8 8 8 8 6 8 
        8 6 8 8 8 8 8 8 8 8 8 8 8 8 8 8 
        8 8 8 8 8 8 8 8 8 8 6 8 8 8 8 8 
        8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 
        8 8 8 8 8 8 6 8 8 8 8 8 8 8 8 8 
        `, false)
    scene.setTile(7, img`
        6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
        7 7 7 7 7 6 6 6 7 7 7 7 7 6 6 6 
        7 7 7 7 7 7 6 7 7 7 7 7 7 7 6 7 
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        7 6 7 7 7 7 6 7 7 7 7 7 6 7 7 7 
        7 7 6 7 7 6 7 7 7 6 7 7 6 7 6 7 
        7 7 6 7 6 6 7 7 6 6 6 7 6 6 6 6 
        6 7 6 6 6 6 7 6 6 6 6 6 8 6 6 6 
        8 8 6 6 8 6 6 6 8 6 6 6 8 8 6 6 
        8 e 6 e e 8 6 6 8 8 6 8 8 8 e 8 
        d e d d e 8 1 b d 8 d b 8 d e e 
        b d b d d b d d d b d d b d d b 
        `, false)
    scene.setTile(13, img`
        d d d d d d d d d d d d d d d d 
        d d d 1 1 d d d d d d d d b d d 
        d d d 1 1 d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d b d d d d d d b b d d d d d 
        d d d d d d d d d b b d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d 1 d 
        d d d d d b d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        1 1 d d d d d d d d d d d d d d 
        1 1 d d d d d d d d d d b d d d 
        d d d d d d 1 d d d d d d d d d 
        d d b d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d b d 
        `, false)
    scene.setTile(11, img`
        d 1 d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d b d d d d d 1 1 d d 
        d d d d d d d d d d d d 1 1 d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d 1 d d d b b d d d d d d d d d 
        d d d d d b b d d d d d d d b d 
        d d d d d d d d d d d d 1 1 d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d 1 d d d b b d d d d d d d d d 
        b b b b b b b b b b b b b b b b 
        7 6 7 6 7 7 7 7 7 6 6 7 7 7 7 6 
        7 7 e 7 e 6 6 6 e 7 7 7 6 e 7 7 
        6 e 6 e 6 6 7 e 6 7 6 e 6 6 e 6 
        `, false)
    scene.setTile(5, img`
        d 1 d d c c c 6 5 c 6 6 d d d d 
        d d d d c 6 c 5 5 c 7 6 d d 1 d 
        d d d 6 c c 7 5 5 7 c 6 6 d d d 
        d d c c 7 7 7 7 7 5 7 7 c 6 d d 
        d 6 6 6 c 6 7 7 7 7 6 c c 6 6 d 
        c 7 7 7 6 c 7 c 6 7 6 7 7 7 7 6 
        c c c 6 6 6 c 6 6 6 6 7 7 6 6 6 
        d c c 7 6 6 6 6 6 7 7 7 7 c 6 d 
        d c 7 7 6 6 7 6 f 7 7 6 7 7 c d 
        d c c c c 7 7 f e e 7 c c c c d 
        d d d d c 7 e f e e 7 c d d d d 
        d 1 d d d 6 f e e e c d d d d d 
        d d d d d d d e e d d d d c d d 
        d d d d d d d e e d d d d d d d 
        7 7 e 7 e 6 6 e e 7 7 7 6 e 7 7 
        6 e 6 e 6 6 7 e e 7 6 e 6 6 e 6 
        `, false)
    totalColumns = tiles.tilemapColumns()
    totalRows = tiles.tilemapRows()
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (levelStarted && playerIsAlive) {
        direction = 1
        movePlayer()
    }
})
function placeEnemiesAgain () {
    for (let value22 of spritesHittingWall) {
        aSpriteSpeed = sprites.readDataNumber(value22, dataSpriteSpeed)
        aSpriteRow = sprites.readDataNumber(value22, dataRow)
        aSpriteColumn = 0
        if (aSpriteSpeed < 0) {
            aSpriteColumn = totalColumns - 1
        }
        grid.place(value22, tiles.getTileLocation(aSpriteColumn, aSpriteRow))
        value22.vx = aSpriteSpeed
    }
    spritesHittingWall = []
}
function stopEnemies () {
    for (let aSprite of sprites.allOfKind(SpriteKind.Car)) {
        aSprite.vx = 0
    }
    for (let aSprite2 of sprites.allOfKind(SpriteKind.Log)) {
        aSprite2.vx = 0
    }
}
function playerLosesLife () {
    music.powerDown.playUntilDone()
    playerIsAlive = false
    isMoving = false
    info.changeLifeBy(-1)
    placePlayerAtStart()
    showLifeGreeting()
}
function setVertialStepsMade () {
    verticalStepsMade = []
    for (let vertitalStepIndex = 0; vertitalStepIndex <= totalRows - 3; vertitalStepIndex++) {
        verticalStepsMade.push(0)
    }
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (levelStarted && playerIsAlive) {
        direction = 2
        movePlayer()
    }
})
scene.onHitWall(SpriteKind.Log, function (sprite, location) {
    spritesHittingWall.push(sprite)
})
function showLifeGreeting () {
    if (info.life() >= 1) {
        game.splash(lifeGreetings[info.life() - 1])
    }
}
function setEnemies () {
    setLogs()
    setCars()
    setNests()
    setEdgeTiles()
}
function readyLevel () {
    setEnemies()
    showLifeGreeting()
    setCountdownToStart()
}
function checkPlayerPosition () {
    if (levelStarted && playerIsAlive) {
        if (isMoving) {
            if (frogging.vx == 0 && frogging.vy == 0) {
                frogging.setPosition(nextPlayerPosition.x, nextPlayerPosition.y)
                isMoving = false
                if (movingTowardsNests) {
                    checkPlayerHitANest()
                } else if (overWater) {
                    checkPlayerOnLog()
                }
            }
        }
    }
}
function setCountdownToStart () {
    info.startCountdown(countdownToStart)
}
function moveEnemies () {
    for (let aSprite3 of sprites.allOfKind(SpriteKind.Car)) {
        aSprite3.vx = sprites.readDataNumber(aSprite3, dataSpriteSpeed)
    }
    for (let aSprite32 of sprites.allOfKind(SpriteKind.Log)) {
        aSprite32.vx = sprites.readDataNumber(aSprite32, dataSpriteSpeed)
    }
}
function scoreMovingUp (nextPlayerPosition: Sprite) {
    verticalStepIndex = tiles.locationXY(tiles.locationOfSprite(nextPlayerPosition), tiles.XY.row) - 1
    if (verticalStepsMade[verticalStepIndex] == 0) {
        info.player1.changeScoreBy(scorePerVerticalStep)
        verticalStepsMade[verticalStepIndex] = 1
    }
}
// Direction (clockwise) [North, East, South, West] [0 = up; 1 = right; 2 = down; 3 = left]
function movePlayer () {
    if (!(isMoving) && !(movingTowardsNests)) {
        isMoving = true
        isOnLog = false
        // reset speed
        frogging.setVelocity(0, 0)
        nextPlayerPosition.setVelocity(0, 0)
        locationFrogging = tiles.locationOfSprite(frogging)
        if (direction == 0) {
            // isMoving up, check whether isMoving over water for the first time or not
            if (overLand) {
                // from land to first row water
                if (tiles.locationXY(locationFrogging, tiles.XY.row) == logsFinishAtRow + 1) {
                    overWater = true
                    overLand = false
                }
            } else if (overWater) {
                // moving to the row of nests?
                if (tiles.locationXY(locationFrogging, tiles.XY.row) == nestsAreInRow + 1) {
                    overWater = false
                    movingTowardsNests = true
                }
            }
        } else if (direction == 2) {
            // isMoving down, check whether isMoving off water
            if (overWater) {
                if (tiles.locationXY(locationFrogging, tiles.XY.row) == logsFinishAtRow) {
                    overWater = false
                    overLand = true
                }
            }
        }
        moveUsingXY()
    }
}
function startLevel () {
    moveEnemies()
    playerIsAlive = true
    levelStarted = true
    info.startCountdown(countdownPlaying)
    timeBeforeGettingNest = game.runtime()
}
function setNests () {
    nestColumns = [
    0,
    0,
    0,
    0,
    0
    ]
    for (let index4 = 0; index4 <= nestColumns.length - 1; index4++) {
        anEmptyNest3 = sprites.create(emptyNestImage, SpriteKind.EmptyNest)
        sprites.setDataNumber(anEmptyNest3, dataNestColumn, index4)
        grid.place(anEmptyNest3, tiles.getTileLocation(nestsStartAtColumn + index4 * 3, 1))
    }
}
let anEmptyNest3: Sprite = null
let locationFrogging: tiles.Location = null
let verticalStepIndex = 0
let verticalStepsMade: number[] = []
let aSpriteColumn = 0
let aSpriteRow = 0
let movingTowardsNests = false
let overWater = false
let totalRows = 0
let allNestsFilled = false
let filledNestValue = 0
let scoreForRemainingTime = 0
let nestColumns: number[] = []
let aNestColumn = 0
let spritesHittingWall: Sprite[] = []
let aLavaSprite: Sprite = null
let aWaterfallSprite: Sprite = null
let carsInRowTotal = 0
let aSpritePropertySet: number[] = []
let carImagesRight: Image[] = []
let carImagesLeft: Image[] = []
let aSprite322: Sprite = null
let totalColumns = 0
let anImage: Image = null
let spriteColumn = 0
let tileColumnNumber = 0
let columnStart = 0
let tileRowNumber = 0
let spriteSpacing = 0
let logImageIndex = 0
let aSpriteSpeed = 0
let spacingMaximum = 0
let spacingMinimum = 0
let logLength = 0
let aLogPropertySet: number[] = []
let logImages: Image[] = []
let aLandedNest: Sprite = null
let landedOnANest = false
let scorePerRemainingSeconds = 0
let scoreAllNests = 0
let scorePerNest = 0
let scorePerVerticalStep = 0
let lifeGreetings: string[] = []
let nestMarginOfErrorX = 0
let nestLandingPositionX = 0
let countdownPlaying = 0
let countdownToStart = 0
let nestsAreInRow = 0
let nestsStartAtColumn = 0
let startingLives = 0
let level = 0
let maxSpeed = 0
let minSpeed = 0
let dataNestColumn = ""
let dataSpriteSpeed = ""
let dataRow = ""
let carsStartAtRow = 0
let logsFinishAtRow = 0
let logsStartAtRow = 0
let totalCarRows = 0
let totalLogRows = 0
let overLand = false
let isMoving = false
let movementXY = 0
let froggingSpeed = 0
let lavaImage: Image = null
let waterfallImage: Image = null
let timeRemainingAfterGettingNest = 0
let timeBeforeGettingNest = 0
let nextPlayerPosition: Sprite = null
let frogging: Sprite = null
let direction = 0
let playerIsAlive = false
let levelStarted = false
let isOnLog = false
let froggingLoverImage: Image = null
let emptyNestImage: Image = null
let froggingImage: Image = null
froggingImage = img`
    . . . . 7 7 7 . . 7 7 7 . . . . 
    . . . . 7 1 8 7 7 7 1 8 . . . . 
    . . . 7 7 8 8 7 7 7 8 8 7 . . . 
    . . . 7 7 7 7 7 7 7 7 7 7 . . . 
    . . . 8 7 f 7 7 7 7 f 7 8 . . . 
    . . . 7 7 7 f f f f 7 7 7 . . . 
    . 7 . . 8 7 7 7 7 7 7 8 . . 7 . 
    . 7 7 . . 7 7 7 7 7 7 . . 7 7 . 
    . . 7 7 8 8 1 1 1 1 8 8 7 7 . . 
    . . . 7 7 7 1 1 1 1 7 7 7 . . . 
    . . . . 7 8 1 1 1 1 8 7 . . . . 
    . . . . . 7 1 1 1 1 7 . . . . . 
    . . . . 7 7 7 7 7 7 7 7 . . . . 
    . . . 7 7 7 . . . . 7 7 7 . . . 
    . . 7 7 . . . . . . . . 7 7 . . 
    . . . . . . . . . . . . . . . . 
    `
emptyNestImage = img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    f f f f f f f f f f f f f f f f 
    f 7 7 7 7 7 7 7 7 7 7 7 7 7 7 f 
    f 7 7 f f f f f f f f f f 7 7 f 
    f 7 7 7 7 7 7 7 7 7 7 7 7 7 7 f 
    f f f f f f f f f f f f f f f f 
    f 7 7 7 7 7 7 7 7 7 7 7 7 7 7 f 
    f 7 f f f 7 f f f 7 f f f f 7 f 
    f 7 f 7 7 7 f 7 7 7 f 7 7 f 7 f 
    f 7 f 7 f 7 f f 7 7 f 7 7 f 7 f 
    f 7 f 7 f 7 f 7 7 7 f 7 7 f 7 f 
    f 7 f f f 7 f f f 7 f f f f 7 f 
    f 7 7 7 7 7 7 7 7 7 7 7 7 7 7 f 
    f f f f f f f f f f f f f f f f 
    `
froggingLoverImage = img`
    . . . . f f f f f f f f . . . . 
    . . . f 5 5 5 5 5 5 5 5 f . . . 
    . . f 5 5 5 5 5 5 5 5 5 5 f . . 
    . f 5 5 f f 5 5 5 5 f f 5 5 f . 
    f 5 5 f f f f 5 5 f f f f 5 5 f 
    f 5 5 f f f 5 5 5 f f f 5 5 5 f 
    f 5 5 f f f 5 5 5 f f f 5 5 5 f 
    f 5 5 f f f f 5 5 f f f f 5 5 f 
    f 5 5 5 f f 5 5 5 5 f f 5 5 5 f 
    f 5 5 5 5 5 5 5 5 5 5 5 5 5 5 f 
    f 5 5 f f f f f f f f f f 5 5 f 
    f 5 5 f f f f f f f f f f 5 5 f 
    . f 5 5 f f f 5 5 5 f f 5 5 f . 
    . . f 5 5 f f f f f f 5 5 f . . 
    . . . f 5 5 5 5 5 5 5 5 f . . . 
    . . . . f f f f f f f f . . . . 
    `
isOnLog = false
game.showLongText("Geocaching Frog Run -ToadAndYoshi", DialogLayout.Full)
game.setDialogCursor(froggingImage)
game.showLongText("Dodge Cars, Jump Onto Turtles and Logs to Reach the Geocache!", DialogLayout.Center)
game.setDialogCursor(emptyNestImage)
game.showLongText("Land on the Geocaches to Earn Points. Clear all Geocachs for 1000 Points!", DialogLayout.Center)
game.setDialogCursor(froggingLoverImage)
game.showLongText("Smile Means You Found the Geocache, Try To Get The Rest!", DialogLayout.Center)
game.setDialogCursor(froggingImage)
setInitialVariables()
setTileMap()
setPlayer()
readyLevel()
game.onUpdate(function () {
    if (levelStarted == true) {
        checkPlayerPosition()
        checkIfPlayerDies()
        placeEnemiesAgain()
    }
})
