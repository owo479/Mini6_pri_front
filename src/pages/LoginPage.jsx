import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginMember, signupMember } from '../services/api'

export default function LoginPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    memberName: '',
    memberEmail: '',
    memberPassword: '',
  })

  const [mode, setMode] = useState('login') // login | signup
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isSignup = mode === 'signup'

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.memberName.trim()) {
      setError('사용자 이름을 입력해주세요.')
      return
    }

    if (!form.memberPassword.trim()) {
      setError('비밀번호를 입력해주세요.')
      return
    }

    try {
      setLoading(true)
      setError('')

      if (isSignup) {
        await signupMember(form)
        alert('회원가입이 완료되었습니다. 로그인해주세요.')
        setMode('login')
        return
      }

      const result = await loginMember({
        memberName: form.memberName,
        memberPassword: form.memberPassword,
      })

      localStorage.setItem('memberName', result.memberName)
      localStorage.setItem('memberEmail', result.memberEmail || '')

      navigate('/books')
    } catch (err) {
      setError(err.message || '처리 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f5f7fb',
      padding: '24px',
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#fff',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        }}
      >
        <h2 style={{ marginBottom: '8px' }}>
          {isSignup ? '회원가입' : '로그인'}
        </h2>

        <p style={{ marginBottom: '24px', color: '#666' }}>
          사용자별 도서 목록을 구분하기 위한 간단 로그인입니다.
        </p>

        {error && (
          <div style={{
            marginBottom: '16px',
            padding: '12px',
            background: '#ffebee',
            color: '#c62828',
            borderRadius: '8px',
            fontSize: '14px',
          }}>
            {error}
          </div>
        )}

        <label>사용자 이름</label>
        <input
          name="memberName"
          value={form.memberName}
          onChange={handleChange}
          placeholder="예: hanbom"
          style={inputStyle}
        />

        {isSignup && (
          <>
            <label>이메일</label>
            <input
              name="memberEmail"
              value={form.memberEmail}
              onChange={handleChange}
              placeholder="선택 입력"
              style={inputStyle}
            />
          </>
        )}

        <label>비밀번호</label>
        <input
          name="memberPassword"
          type="password"
          value={form.memberPassword}
          onChange={handleChange}
          placeholder="비밀번호"
          style={inputStyle}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            marginTop: '16px',
            padding: '12px',
            border: 'none',
            borderRadius: '8px',
            background: '#1976d2',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? '처리 중...' : isSignup ? '회원가입' : '로그인'}
        </button>

        <button
          type="button"
          onClick={() => {
            setMode(isSignup ? 'login' : 'signup')
            setError('')
          }}
          style={{
            width: '100%',
            marginTop: '12px',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          {isSignup ? '이미 계정이 있어요' : '회원가입하기'}
        </button>
      </form>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  marginTop: '6px',
  marginBottom: '14px',
  padding: '11px 12px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  fontSize: '14px',
}