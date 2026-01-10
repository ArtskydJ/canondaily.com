var assert = require('assert')
var tip = require('../text-indentation-parser.js')

var expected = [
  {
    text: 'Revelation',
    children: [
      {
        text: 'Introduction',
        children: [
          {
            text: '1:1-11 How to read the book and submit to it',
            children: []
          }
        ]
      },
      {
        text: 'First Septet - The seven churches - The church militant',
        children: [
          {
            text: '1:12-20 Introduction to the seven churches - Christ is present with His church',
            children: []
          },
          {
            text: '2:1-7 Ephesus',
            children: []
          },
          {
            text: '2:8-11 Smyrna',
            children: []
          },
          {
            text: '2:12-17 Pergamos',
            children: []
          },
          {
            text: '2:18-29 Thyatira',
            children: []
          },
          {
            text: '3:1-6 Sardis',
            children: []
          },
          {
            text: '3:7-13 Philadelphia',
            children: []
          },
          {
            text: '3:14-22 Laodicea',
            children: []
          }
        ]
      },
      {
        text: 'Second Septet - The seven seals - Release of court judgments',
        children: [
          {
            text: '4:1-5:14 Introduction to the seven seals - Christ is on His throne and is governing',
            children: []
          },
          {
            text: '6:1-2 Seal 1 - The white horse',
            children: []
          },
          {
            text: '6:3-4 Seal 2 - The red horse',
            children: []
          },
          {
            text: '6:5-6 Seal 3 - The black horse',
            children: []
          },
          {
            text: '6:7-8 Seal 4 - The yellowish-green horse',
            children: []
          },
          {
            text: '6:9-11 Seal 5 - The souls under the altar',
            children: []
          },
          {
            text: '6:12-17 Seal 6 - The earthquake',
            children: []
          }
        ]
      }
    ]
  },
  {
    text: 'Genesis',
    children: [
      {
        text: 'alpha',
        children: [
          {
            text: 'acorn',
            children: []
          },
          {
            text: 'abacus',
            children: []
          }
        ]
      },
      {
        text: 'bravo',
        children: [
          {
            text: 'blaze',
            children: []
          },
          {
            text: 'black',
            children: []
          }
        ]
      },
      {
        text: 'charlie',
        children: [
          {
            text: 'control',
            children: []
          },
          {
            text: 'case in point',
            children: []
          }
        ]
      }
    ]
  },
  {
    text: 'Exodus',
    children: [
      {
        text: 'Levi',
        children: [
          {
            text: 'Number',
            children: [
              {
                text: 'Duet',
                children: [
                  {
                    text: 'Josh',
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    text: 'Judge',
    children: [
      {
        text: 'Ruth',
        children: [
          {
            text: 'Sam',
            children: [
              {
                text: 'Kings',
                children: []
              }
            ]
          }
        ]
      }
    ]
  }
]


var actual = tip(`Revelation
-- comment on the root level
	Introduction
		1:1-11 How to read the book and submit to it
	First Septet - The seven churches - The church militant
    -- indented comment
		1:12-20 Introduction to the seven churches - Christ is present with His church
		2:1-7 Ephesus
		2:8-11 Smyrna -- comment at the end of a line
		2:12-17 Pergamos
		2:18-29 Thyatira
		3:1-6 Sardis
		3:7-13 Philadelphia
		3:14-22 Laodicea
	Second Septet - The seven seals - Release of court judgments
		4:1-5:14 Introduction to the seven seals - Christ is on His throne and is governing
		6:1-2 Seal 1 - The white horse
		6:3-4 Seal 2 - The red horse
		6:5-6 Seal 3 - The black horse
		6:7-8 Seal 4 - The yellowish-green horse
		6:9-11 Seal 5 - The souls under the altar
		6:12-17 Seal 6 - The earthquake
    
Genesis
	alpha
		acorn
		abacus
	bravo
		blaze
		black
	charlie
		control
		case in point
Exodus
	Levi
		Number
			Duet
				Josh
Judge
	Ruth
		Sam
			Kings`)

assert.deepEqual( actual, expected )
console.log('ok')
