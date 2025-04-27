import { NextRequest, NextResponse } from 'next/server'

type User = {
  email: string
  password: string
  isAdmin: boolean
}

const users: User[] = [
  {
    email: 'admin@example.com',
    password: 'password',
    isAdmin: true,
  },
  {
    email: 'manager@example.com',
    password: 'password',
    isAdmin: false,
  },
  {
    email: 'employee@example.com',
    password: 'password',
    isAdmin: false,
  },
]

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
    }
    const user = users.find((it) => {
      return it.email === email && it.password === password
    })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { success: true, isAdmin: user.isAdmin },
      { status: 200 }
    )
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
