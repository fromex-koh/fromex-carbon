interface RichTextProps {
  /** 굵게 처리할 구간을 **이렇게** 감싼 문자열 */
  text: string
}

// 데이터에 ** 표기로 넣어 두면 여기서 <strong> 으로 바꾼다.
const RichText = ({ text }: RichTextProps) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)

  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={`${index}-${part}`} className="font-bold">
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  )
}

export default RichText
