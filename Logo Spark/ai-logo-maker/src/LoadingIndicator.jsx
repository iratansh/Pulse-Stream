import { FaSpinner } from 'react-icons/fa';

export default function LoadingIndicator({ message = "Loading..." }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '300px',
      width: '100%',
      textAlign: 'center'
    }}>
      <FaSpinner 
        style={{
          fontSize: '3rem', 
          color: '#3b82f6',
          animation: 'spin 2s linear infinite',
          marginBottom: '1rem'
        }}
      />
      <p style={{ fontSize: '1.2rem', color: '#4b5563' }}>{message}</p>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}