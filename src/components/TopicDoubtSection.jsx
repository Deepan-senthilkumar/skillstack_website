import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, CheckCircle2, Clock, User, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';
import { api } from '../api';

export default function TopicDoubtSection({ topic, currentUser }) {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const topicId = topic?.id || topic?.topic_id;

  const fetchDoubts = async () => {
    if (!topicId) return;
    setLoading(true);
    try {
      const data = await api.getTopicDoubts(topicId);
      if (Array.isArray(data)) {
        setDoubts(data);
      }
    } catch (e) {
      console.warn('Failed to load topic doubts:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoubts();
  }, [topicId]);

  const handleSubmitDoubt = async (e) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    setSubmitting(true);
    setFeedbackMsg(null);
    try {
      const newDoubt = await api.askTopicDoubt(topicId, questionText.trim());
      setQuestionText('');
      setFeedbackMsg({
        type: 'success',
        text: 'Your doubt was submitted directly to Prof. Deepan! You will receive a private clarification message here.'
      });
      fetchDoubts();
    } catch (err) {
      setFeedbackMsg({
        type: 'error',
        text: err?.message || 'Could not submit doubt. Please check login session.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1.5px solid rgba(124, 58, 237, 0.14)',
      borderRadius: '24px',
      padding: '28px 32px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
      marginBottom: '28px',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        paddingBottom: '20px',
        borderBottom: '1px solid #E2E8F0',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)'
          }}>
            <MessageSquare size={22} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
              1-on-1 Topic Doubt &amp; Clarification
            </h3>
            <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#64748B' }}>
              Ask a question about <strong style={{ color: '#7C3AED' }}>{topic?.title}</strong>. Responses are sent privately only to you by Prof. Deepan.
            </p>
          </div>
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(22, 163, 74, 0.08)',
          color: '#16A34A',
          border: '1px solid rgba(22, 163, 74, 0.2)',
          padding: '4px 12px',
          borderRadius: '999px',
          fontSize: '11.5px',
          fontWeight: 700
        }}>
          <ShieldCheck size={14} />
          <span>Private 1-on-1 Trainer Messenger</span>
        </div>
      </div>

      {/* Doubt Input Form */}
      <form onSubmit={handleSubmitDoubt} style={{ marginBottom: '32px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
          Have a doubt or concept question on this topic?
        </label>
        <div style={{ position: 'relative' }}>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Type your specific doubt here (e.g. Why does malloc return void*? How does memory fragmentation happen in C heap?)..."
            rows={3}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '16px',
              border: '1.5px solid #CBD5E1',
              fontSize: '13.5px',
              fontFamily: 'inherit',
              lineHeight: 1.5,
              resize: 'vertical',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'border-color 0.2s',
              background: '#F8FAFC'
            }}
            onFocus={(e) => { e.target.style.borderColor = '#7C3AED'; e.target.style.background = '#FFFFFF'; }}
            onBlur={(e) => { e.target.style.borderColor = '#CBD5E1'; e.target.style.background = '#F8FAFC'; }}
          />
        </div>

        {feedbackMsg && (
          <div style={{
            marginTop: '10px',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '12.5px',
            fontWeight: 600,
            background: feedbackMsg.type === 'success' ? '#DCFCE7' : '#FEE2E2',
            color: feedbackMsg.type === 'success' ? '#166534' : '#991B1B',
            border: `1px solid ${feedbackMsg.type === 'success' ? '#86EFAC' : '#FCA5A5'}`
          }}>
            {feedbackMsg.text}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
          <button
            type="submit"
            disabled={submitting || !questionText.trim()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 22px',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: submitting || !questionText.trim() ? 'not-allowed' : 'pointer',
              opacity: submitting || !questionText.trim() ? 0.6 : 1,
              boxShadow: '0 4px 14px rgba(124, 58, 237, 0.25)',
              transition: 'all 0.2s ease'
            }}
          >
            <Send size={14} />
            <span>{submitting ? 'Sending to Trainer...' : 'Send Doubt to Prof. Deepan'}</span>
          </button>
        </div>
      </form>

      {/* Past Doubts & Clarifications List */}
      <div>
        <h4 style={{
          fontSize: '14.5px',
          fontWeight: 800,
          color: '#0F172A',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>Your Doubts on this Topic ({doubts.length})</span>
        </h4>

        {loading ? (
          <div style={{ padding: '24px 0', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
            Loading questions and trainer responses...
          </div>
        ) : doubts.length === 0 ? (
          <div style={{
            padding: '30px 20px',
            textAlign: 'center',
            background: '#F8FAFC',
            borderRadius: '16px',
            border: '1px dashed #CBD5E1',
            color: '#64748B'
          }}>
            <HelpCircle size={32} color="#94A3B8" style={{ marginBottom: '8px' }} />
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#334155' }}>
              No doubts submitted yet for this topic.
            </div>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>
              If any concept or code snippet is unclear, ask above to get personal clarification directly from Prof. Deepan.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {doubts.map((doubt) => {
              const isResolved = doubt.status === 'RESOLVED' && doubt.clarification_reply;
              return (
                <div
                  key={doubt.id}
                  style={{
                    background: '#FFFFFF',
                    border: `1.5px solid ${isResolved ? '#BBF7D0' : '#E2E8F0'}`,
                    borderRadius: '18px',
                    padding: '20px 24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}
                >
                  {/* Status Strip */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: '999px',
                        background: isResolved ? '#DCFCE7' : '#FEF3C7',
                        color: isResolved ? '#166534' : '#92400E',
                        border: `1px solid ${isResolved ? '#86EFAC' : '#FDE68A'}`,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        {isResolved ? (
                          <>
                            <CheckCircle2 size={12} />
                            <span>Clarified by Prof. Deepan</span>
                          </>
                        ) : (
                          <>
                            <Clock size={12} />
                            <span>Pending Trainer Clarification</span>
                          </>
                        )}
                      </span>
                    </div>

                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                      {doubt.created_at ? new Date(doubt.created_at).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>

                  {/* Student Question */}
                  <div style={{ marginBottom: isResolved ? '18px' : '0' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                      Your Doubt:
                    </div>
                    <div style={{ fontSize: '14px', color: '#0F172A', fontWeight: 600, lineHeight: 1.5, background: '#F8FAFC', padding: '12px 16px', borderRadius: '12px' }}>
                      {doubt.question}
                    </div>
                  </div>

                  {/* Instructor Clarification Box */}
                  {isResolved && (
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.04) 0%, rgba(34, 197, 94, 0.06) 100%)',
                      border: '1.5px solid rgba(22, 163, 74, 0.25)',
                      borderRadius: '14px',
                      padding: '16px 20px',
                      position: 'relative'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            background: '#16A34A',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 800
                          }}>
                            D
                          </div>
                          <div>
                            <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#166534' }}>
                              Prof. Deepan S
                            </span>
                            <span style={{ fontSize: '10.5px', color: '#64748B', marginLeft: '6px' }}>
                              • Lead Trainer Clarification
                            </span>
                          </div>
                        </div>

                        {doubt.replied_at && (
                          <span style={{ fontSize: '10.5px', color: '#64748B' }}>
                            {new Date(doubt.replied_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>

                      <div style={{
                        fontSize: '13.5px',
                        color: '#14532D',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap',
                        paddingTop: '4px'
                      }}>
                        {doubt.clarification_reply}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
