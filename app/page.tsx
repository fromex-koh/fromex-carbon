import type { Metadata } from "next"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ExternalLink,
  FileText,
  Folder,
  GitBranch,
  History,
  Info,
  PackageCheck,
  TriangleAlert,
} from "lucide-react"
import { cn } from "@/lib/utils"
import releaseInfo from "@/lib/publishing/release-info.json"
import { RELEASE_NOTES, findAssetVersion } from "@/lib/publishing/release-note"
import type {
  ReleaseNoteChange,
  ReleaseNoteHandoff,
  ReleaseNoteHandoffMode,
} from "@/lib/publishing/release-note"
import handoffAssets from "@/lib/publishing/handoff-assets.json"

const DEPTH_HEADS = ["1뎁스", "2뎁스", "3뎁스", "4뎁스", "5뎁스"]

const REPOSITORY_URL = "https://github.com/fromex-koh/fromex-carbon"
const REPOSITORY_LABEL = "github.com/fromex-koh/fromex-carbon"
const AUTHOR = "이윤화 (웹 퍼블리싱)"

const REPOSITORY_LINKS = [
  {
    term: "저장소",
    href: REPOSITORY_URL,
    branch: "(main 브랜치)",
  },
  {
    term: "FE 전달용",
    href: `${REPOSITORY_URL}/tree/frontend-handoff`,
    branch: "(frontend-handoff 브랜치)",
  },
]

const IA_ROWS = [
  {
    no: 1,
    user: "비회원·회원",
    type: "Page",
    status: "유지",
    uiux: "대기중",
    version: "미배포",
    desc: "메인 홈 화면",
    cells: [
      { level: 1, name: "메인 홈", rowSpan: 53, colSpan: 1 },
      { level: 2, name: "메인 화면", rowSpan: 1, colSpan: 4 },
    ],
  },
  {
    no: 2,
    user: "비회원·회원",
    type: "Page",
    status: "변경",
    uiux: "대기중",
    version: "미배포",
    desc: "탄소중립 선도기업 제도 설명 화면 / 자가진단으로 이동하는 버튼 포함 - 자가진단, 선도기업 1차, 중간점검, 최종점검",
    cells: [
      { level: 2, name: "탄소중립 선도기업", rowSpan: 40, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 3 },
    ],
  },
  {
    no: 3,
    user: "비회원·회원",
    type: "Page",
    status: "변경",
    uiux: "대기중",
    version: "미배포",
    desc: "Step 1, 정보 입력",
    cells: [
      { level: 3, name: "자가진단", rowSpan: 13, colSpan: 1 },
      { level: 4, name: "기업 정보 입력", rowSpan: 1, colSpan: 2 },
    ],
  },
  {
    no: 4,
    user: "비회원·회원",
    type: "Page",
    status: "변경",
    uiux: "대기중",
    version: "미배포",
    desc: "Step 2, 정보 입력 / 계산결과 도출",
    cells: [
      { level: 4, name: "인벤토리 배출량 산정", rowSpan: 3, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 1 },
    ],
  },
  {
    no: 5,
    user: "비회원·회원",
    type: "Modal Popup",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "인벤토리 항목 선택 팝업",
    cells: [{ level: 5, name: "항목 선택", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 6,
    user: "비회원·회원",
    type: "Dialog",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "Scope 설명 팝업",
    cells: [{ level: 5, name: "Scope설명", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 7,
    user: "비회원·회원",
    type: "Page",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "Step 3, 기준연도 배출량 확인, 정보 입력 / 계산결과 도출",
    cells: [
      { level: 4, name: "감축잠재량 산정", rowSpan: 2, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 1 },
    ],
  },
  {
    no: 8,
    user: "비회원·회원",
    type: "Dialog",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "삭제 확인 팝업 - 사업 [삭제] 버튼 선택 시 노출",
    cells: [{ level: 5, name: "삭제 확인 팝업", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 9,
    user: "비회원·회원",
    type: "Page",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "Step 4, 탄소감축 목표 감축사업, 정보 입력 / 비교결과 도출",
    cells: [{ level: 4, name: "감축목표 설정", rowSpan: 1, colSpan: 2 }],
  },
  {
    no: 10,
    user: "비회원·회원",
    type: "Page",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "Step 5, 평가표 작성 / 점수 및 등급 도출 / 버튼 클릭시 결과 확인 모달 팝업 호출",
    cells: [
      { level: 4, name: "평가지표 작성", rowSpan: 4, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 1 },
    ],
  },
  {
    no: 11,
    user: "비회원·회원",
    type: "Dialog",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: '설명 팝업 1.2.2 탄소중립 전문역량 향상 노력 [4번째 체크항목 "탄소중립 관련 의무 교육을 수 료하고 있는 경우" 옆 ?] 선택 시 노출되는 팝업',
    cells: [
      {
        level: 5,
        name: "탄소중립·환경·에너지 분야 관련 의무 교육",
        rowSpan: 1,
        colSpan: 1,
      },
    ],
  },
  {
    no: 12,
    user: "비회원·회원",
    type: "Dialog",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: '설명 팝업 2.1.1 탄소배출량 산정 [3번째 항목 "(Scope 3) …" 의 * (예시) 중소기업 온실가스 배출원(Scope 1,2,3) 옆 ?] 선택 시 노출되는 팝업',
    cells: [
      {
        level: 5,
        name: "(예시) 중소기업 온실가스 배출원 (Scope 1, 2, 3)",
        rowSpan: 1,
        colSpan: 1,
      },
    ],
  },
  {
    no: 13,
    user: "비회원·회원",
    type: "Dialog",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: '설명 팝업 2.2.5 탄소감축 자발적 행동 [4번째 항목 "(제품·기술에 대한 환경분야 국가인증 취득) …" 옆 ?] 선택 시 노출되는 팝업.',
    cells: [
      {
        level: 5,
        name: "국가에서 관리하는 환경분야 인증 종류",
        rowSpan: 1,
        colSpan: 1,
      },
    ],
  },
  {
    no: 14,
    user: "비회원·회원",
    type: "Page",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "Step 6, 결과 확인 화면 , 신청서 출력 / 선도기업 신청 이동 버튼",
    cells: [
      { level: 4, name: "결과 확인", rowSpan: 2, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 1 },
    ],
  },
  {
    no: 15,
    user: "",
    type: "Link",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "결과 보고서 다운로드",
    cells: [{ level: 5, name: "결과 확인서", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 16,
    user: "회원",
    type: "Page",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "Step 1, 정보 입력(회원정보 및 자가진단 정보 일부 연동) - 탄소중립 기준연도 현황 (자가진단 데이터 불러오기)",
    cells: [
      { level: 3, name: "선도기업 신청 1차", rowSpan: 7, colSpan: 1 },
      { level: 4, name: "신청서 작성", rowSpan: 1, colSpan: 2 },
    ],
  },
  {
    no: 17,
    user: "회원",
    type: "Page",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "Step 2, 서류 제출 (파일 업로드 기능) , 이전, 다음 버튼",
    cells: [{ level: 4, name: "서류 제출", rowSpan: 1, colSpan: 2 }],
  },
  {
    no: 18,
    user: "회원",
    type: "Page",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "Step 3, 최종확인 화면, 수정하기, 제출하기 버튼",
    cells: [
      { level: 4, name: "최종 확인", rowSpan: 5, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 1 },
    ],
  },
  {
    no: 19,
    user: "회원",
    type: "Modal Popup",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "신청서 제출 확인 팝업, 취소, 제출하기 버튼",
    cells: [{ level: 5, name: "제출 확인 팝업", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 20,
    user: "회원",
    type: "Page",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "Step 4, 결과 확인 화면 , 출력물 받기 / 신청내역 확인 이동 버튼",
    cells: [{ level: 5, name: "결과 확인", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 21,
    user: "",
    type: "Link",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "신청서 다운로드",
    cells: [{ level: 5, name: "신청서", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 22,
    user: "",
    type: "Link",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "결과 보고서 다운로드 (콘텐츠 미수급), 제공 미정",
    cells: [{ level: 5, name: "결과 확인서", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 23,
    user: "회원",
    type: "Page",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "Step 1, 정보 입력(회원정보 및 자가진단 정보 일부 연동) - 탄소중립 기준연도 현황 (자가진단 데이터 불러오기)",
    cells: [
      { level: 3, name: "선도기업 신청 2차", rowSpan: 7, colSpan: 1 },
      { level: 4, name: "신청서 작성", rowSpan: 1, colSpan: 2 },
    ],
  },
  {
    no: 24,
    user: "회원",
    type: "Page",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "Step 2, 서류 제출 (파일 업로드 기능), 이전, 다음 버튼",
    cells: [{ level: 4, name: "서류 제출", rowSpan: 1, colSpan: 2 }],
  },
  {
    no: 25,
    user: "회원",
    type: "Page",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "Step 3, 최종확인 화면, 수정하기, 제출하기 버튼",
    cells: [
      { level: 4, name: "최종 확인", rowSpan: 2, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 1 },
    ],
  },
  {
    no: 26,
    user: "회원",
    type: "Modal Popup",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "신청서 제출 확인 팝업, 취소, 제출하기 버튼",
    cells: [{ level: 5, name: "제출 확인 팝업", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 27,
    user: "회원",
    type: "Page",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "Step 4, 결과 확인 화면 , 출력물 받기 / 신청내역 확인 이동 버튼",
    cells: [
      { level: 4, name: "결과 확인", rowSpan: 3, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 1 },
    ],
  },
  {
    no: 28,
    user: "",
    type: "Link",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "신청서 다운로드",
    cells: [{ level: 5, name: "신청서", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 29,
    user: "",
    type: "Link",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "결과 보고서 다운로드 (콘텐츠 미수급), 제공 미정",
    cells: [{ level: 5, name: "결과 확인서", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 30,
    user: "회원",
    type: "Page",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "Step 1, 정보 입력, 기업정보 - 내정보 불러오기, 탄소중립 기준연도현황 - 기존데이터 불러오기 기능",
    cells: [
      { level: 3, name: "선도기업 신청 3차", rowSpan: 11, colSpan: 1 },
      { level: 4, name: "신청서 작성", rowSpan: 1, colSpan: 2 },
    ],
  },
  {
    no: 31,
    user: "회원",
    type: "Page",
    status: "변경",
    uiux: "대기중",
    version: "미배포",
    desc: "Step 2, 정보 입력 / 계산결과 도출",
    cells: [
      { level: 4, name: "인벤토리 배출량 산정", rowSpan: 3, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 1 },
    ],
  },
  {
    no: 32,
    user: "회원",
    type: "Modal Popup",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "인벤토리 항목 선택 팝업",
    cells: [{ level: 5, name: "항목 선택", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 33,
    user: "회원",
    type: "Dialog",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "Scope 설명 팝업",
    cells: [{ level: 5, name: "Scope설명", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 34,
    user: "회원",
    type: "Page",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "Step 3, 감축목표 설정 vs 배출량 실적 비교 결과 제시",
    cells: [{ level: 4, name: "목표달성 평가", rowSpan: 1, colSpan: 2 }],
  },
  {
    no: 35,
    user: "회원",
    type: "Page",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "Step 4, 서류 제출 (파일 업로드 기능), 이전, 다음 버튼",
    cells: [{ level: 4, name: "서류 제출", rowSpan: 1, colSpan: 2 }],
  },
  {
    no: 36,
    user: "회원",
    type: "Page",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "Step 5, 최종확인 화면, 수정하기, 제출하기 버튼",
    cells: [
      { level: 4, name: "최종 확인", rowSpan: 2, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 1 },
    ],
  },
  {
    no: 37,
    user: "회원",
    type: "Modal Popup",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "신청서 제출 확인 팝업, 취소, 제출하기 버튼",
    cells: [{ level: 5, name: "제출 확인 팝업", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 38,
    user: "회원",
    type: "Page",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "Step 6, 결과 확인 화면 , 출력물 받기 / 신청내역 확인 이동 버튼",
    cells: [
      { level: 4, name: "결과 확인", rowSpan: 3, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 1 },
    ],
  },
  {
    no: 39,
    user: "",
    type: "Link",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "신청서 다운로드",
    cells: [{ level: 5, name: "신청서", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 40,
    user: "",
    type: "Link",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "결과 보고서 다운로드 (콘텐츠 미수급), 제공 미정",
    cells: [{ level: 5, name: "결과 확인서", rowSpan: 1, colSpan: 1 }],
  },
  {
    no: 41,
    user: "회원",
    type: "Link",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "로그인 상태에서 선택 시, 현황조회 화면으로 이동시킴 (화면은 없음)",
    cells: [
      {
        level: 3,
        name: "신청내역 확인 및 확인서 발급",
        rowSpan: 1,
        colSpan: 3,
      },
    ],
  },
  {
    no: 42,
    user: "비회원·회원",
    type: "Page",
    status: "변경",
    uiux: "대기중",
    version: "미배포",
    desc: "(택소노미 안내 화면으로) 검색 입력창 추가, 전문평가 및 자가진단 버튼 포함",
    cells: [
      { level: 2, name: "K-택소노미 적합성평가", rowSpan: 11, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 3 },
    ],
  },
  {
    no: 43,
    user: "비회원·회원",
    type: "Page",
    status: "변경",
    uiux: "대기중",
    version: "미배포",
    desc: "선택형 체크박스 구조의 화면, 검색기능 포함, 텍스트가 있는 간단한 모달 팝업(자세히보기)",
    cells: [
      { level: 3, name: "찾아보기", rowSpan: 3, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 2 },
    ],
  },
  {
    no: 44,
    user: "비회원·회원",
    type: "Page",
    status: "변경",
    uiux: "대기중",
    version: "미배포",
    desc: "분류 결과 안내 화면, 버튼 선택 시 분류 결과 모달 팝업 호출",
    cells: [{ level: 4, name: "결과확인", rowSpan: 1, colSpan: 2 }],
  },
  {
    no: 45,
    user: "비회원·회원",
    type: "Dialog",
    status: "변경",
    uiux: "대기중",
    version: "미배포",
    desc: "다운로드, 보증상담 신청 버튼 포함, 보증상담 신청 버튼 선택 시 기술보증 사이트로 이동",
    cells: [{ level: 4, name: "분류 결과", rowSpan: 1, colSpan: 2 }],
  },
  {
    no: 46,
    user: "비회원·회원",
    type: "Page",
    status: "변경",
    uiux: "대기중",
    version: "미배포",
    desc: "6대 환경목표 선택화면 / 선택시 해당하는 경제활동 선택 모달팝업 호출",
    cells: [
      { level: 3, name: "자가진단", rowSpan: 4, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 2 },
    ],
  },
  {
    no: 47,
    user: "비회원·회원",
    type: "Page",
    status: "변경",
    uiux: "대기중",
    version: "미배포",
    desc: "버튼형 선택형 질문",
    cells: [{ level: 4, name: "상세 질문", rowSpan: 1, colSpan: 2 }],
  },
  {
    no: 48,
    user: "비회원·회원",
    type: "Page",
    status: "변경",
    uiux: "대기중",
    version: "미배포",
    desc: "분류 결과 안내 화면, 버튼 선택 시 분류 결과 모달 팝업 호출",
    cells: [{ level: 4, name: "결과확인", rowSpan: 1, colSpan: 2 }],
  },
  {
    no: 49,
    user: "비회원·회원",
    type: "Dialog",
    status: "변경",
    uiux: "대기중",
    version: "미배포",
    desc: "다운로드, 보증상담 신청 버튼 포함, 보증상담 신청 버튼 선택 시 기술보증 사이트로 이동",
    cells: [{ level: 4, name: "분류 결과", rowSpan: 1, colSpan: 2 }],
  },
  {
    no: 50,
    user: "기관 회원",
    type: "Page",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "비로그인 상태에서는 비노출, 기관 로그인 시에만 노출되는 메뉴",
    cells: [
      { level: 3, name: "전문평가", rowSpan: 3, colSpan: 1 },
      { level: 0, name: "", rowSpan: 1, colSpan: 2 },
    ],
  },
  {
    no: 51,
    user: "기관 회원",
    type: "Page",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "평가자 및 기업정보 입력, 경제활동선택 모달, 녹색여신인정비율, 동의체크박스 포함",
    cells: [{ level: 4, name: "사전정보입력", rowSpan: 1, colSpan: 2 }],
  },
  {
    no: 52,
    user: "기관 회원",
    type: "Page",
    status: "신규",
    uiux: "대기중",
    version: "미배포",
    desc: "버튼형 선택형 질문, 하이퍼링크연결, 파일첨부, 의견작성, 제출처 팝업호출, 제출하기",
    cells: [{ level: 4, name: "적합성 평가", rowSpan: 1, colSpan: 2 }],
  },
  {
    no: 53,
    user: "회원",
    type: "Page",
    status: "유지",
    uiux: "대기중",
    version: "미배포",
    desc: "로그인 후에 노출되는 메뉴 화면, 선도기업 신청 내역 및 선도기업 신청 확인서 발급, 전문가 평가 결과 및 결과 다운로드",
    cells: [{ level: 2, name: "현황조회", rowSpan: 1, colSpan: 4 }],
  },
  {
    no: 54,
    user: "비회원",
    type: "Page",
    status: "유지",
    uiux: "대기중",
    version: "미배포",
    desc: "기술보증기금 로그인 사이트에서 처리함",
    cells: [
      { level: 1, name: "공통", rowSpan: 2, colSpan: 1 },
      { level: 2, name: "로그인", rowSpan: 1, colSpan: 4 },
    ],
  },
  {
    no: 55,
    user: "비회원",
    type: "Page",
    status: "유지",
    uiux: "대기중",
    version: "미배포",
    desc: "기술보증기금 로그인 사이트에서 처리함",
    cells: [{ level: 2, name: "회원가입", rowSpan: 1, colSpan: 4 }],
  },
  {
    no: 56,
    user: "비회원·회원",
    type: "-",
    status: "유지",
    uiux: "대기중",
    version: "미배포",
    desc: "푸터 1) 이용안내, 개인정보 처리방침, 저작권 정책 2) 찾아오시는 길 : 선택 시 해당 화면으로 새창 열림. 3) SNS 아이콘 메뉴 : 페이스북, 트위터(X), 인스타그램, 유튜브, 네이버 블로그",
    cells: [{ level: 1, name: "푸터", rowSpan: 1, colSpan: 5 }],
  },
]

const UIUX_VARIANT = {
  대기중: "slate",
  진행중: "blue",
  수정요청: "destructive",
  보완: "orange",
  완료: "forest",
  최종완료: "violet",
} as const

type UiuxKey = keyof typeof UIUX_VARIANT

const getUiuxVariant = (uiux: string) =>
  uiux in UIUX_VARIANT ? UIUX_VARIANT[uiux as UiuxKey] : "outline"

export const metadata: Metadata = {
  title: "퍼블리싱 인덱스",
}

// 전달 카드 구분별 배지. kibo-ktop 의 Diff 확인·신규 추가·덮어쓰기 표기를 따른다.
const HANDOFF_PRESENTATION: Record<
  ReleaseNoteHandoffMode,
  { label: string; variant: "blue" | "success" | "violet" }
> = {
  diff: { label: "Diff 확인", variant: "blue" },
  new: { label: "신규 추가", variant: "success" },
  overwrite: { label: "덮어쓰기", variant: "violet" },
}

// 방금 배포한 것만 강조한다. 두 표가 같은 배경색을 쓴다.
// 표에 이미 회색 계열(bg-muted)이 쓰여 대비가 서도록 앰버를 골랐다.
// TableRow 원본의 hover:bg-muted/50 이 강조를 덮으므로 hover 도 앰버로 지정한다.
// cn 이 tailwind-merge 라 나중에 들어오는 className 쪽이 이긴다.
const LATEST_HIGHLIGHT = "bg-amber-500/20 hover:bg-amber-500/30"

const COMMIT_LINK_LABELS = ["커밋", "GitHub Diff", "Diff 링크"]
const MARKDOWN_LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g

// 커밋 계열 라벨의 값은 "[변경사항 보기](URL)" 형태로 적는다. 링크로 바꿔 준다.
const parseCommitLinks = (label: string, value: string) => {
  if (!COMMIT_LINK_LABELS.includes(label)) return []
  return [...value.matchAll(MARKDOWN_LINK_PATTERN)].map((match) => ({
    text: match[1],
    href: match[2],
  }))
}

const ReleaseNoteDetailValue = ({
  label,
  value,
}: {
  label: string
  value: string
}) => {
  const commitLinks = parseCommitLinks(label, value)

  if (commitLinks.length > 0) {
    return (
      <span className="flex flex-col gap-1">
        {commitLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary inline-flex w-fit items-center gap-1.5 rounded font-medium hover:underline"
          >
            <ExternalLink aria-hidden="true" className="size-4 shrink-0" />
            {link.text} (새 창)
          </a>
        ))}
      </span>
    )
  }

  // 대상은 줄바꿈으로 여러 경로를 적을 수 있다.
  if (label === "대상") {
    return (
      <span className="flex flex-wrap gap-1.5">
        {value.split("\n").map((target) => (
          <code
            key={target}
            className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs break-all"
          >
            {target}
          </code>
        ))}
      </span>
    )
  }

  return <span className="break-keep">{value}</span>
}

const ReleaseNoteHandoffCard = ({ change }: { change: ReleaseNoteHandoff }) => {
  const { label, variant } = HANDOFF_PRESENTATION[change.mode]

  return (
    <div className="border-border flex flex-col gap-3 rounded-md border p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={variant}>{label}</Badge>
        <p className="text-sm font-medium break-keep">{change.title}</p>
      </div>
      <dl className="flex flex-col gap-1.5 text-sm">
        {change.details.map((detail) => (
          <div
            key={`${detail.label}-${detail.value}`}
            className="flex flex-wrap gap-2"
          >
            <dt className="text-muted-foreground w-10 shrink-0">
              {detail.label}
            </dt>
            <dd className="flex-1">
              <ReleaseNoteDetailValue
                label={detail.label}
                value={detail.value}
              />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

const isHandoffChange = (
  change: ReleaseNoteChange,
): change is ReleaseNoteHandoff => typeof change !== "string"

const formatReleaseDate = (isoDate: string) => {
  if (!isoDate) return "-"

  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(
    new Date(isoDate),
  )
}

const formatReleasedAt = (isoDate: string) => {
  if (!isoDate) return ""

  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(isoDate))
}

const PublishingIndexPage = () => {
  const releasedAt = formatReleasedAt(releaseInfo.releasedAt)
  const releaseNotes = RELEASE_NOTES
  const latestVersion = releaseNotes[0]?.version

  // IA 행은 자기 버전이 최신 릴리스와 같을 때 강조한다.
  const isLatestScreen = (version: string) =>
    latestVersion !== undefined && version === latestVersion

  return (
    <div className="flex w-full flex-col items-center px-4 py-10">
      <div className="flex w-full max-w-[1276px] flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold sm:text-2xl">퍼블리싱 인덱스</h1>
            <Badge variant="forest" className="text-sm">
              탄소중립 플랫폼 FO · IA V1.21_260818
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            현재 버전:{" "}
            <span className="text-foreground font-medium">
              {releaseInfo.version}
            </span>
            {releasedAt && ` / ${releasedAt}`}
          </p>
          <p className="text-muted-foreground text-xs">
            메뉴 자체가 화면인 행의 미사용 하위 뎁스는 병합된 &apos;-&apos;로
            표시합니다.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Info
                aria-hidden="true"
                className="text-primary size-5 shrink-0"
              />
              프로젝트 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="flex flex-col gap-3 text-sm">
              {REPOSITORY_LINKS.map((link) => (
                <div
                  key={link.term}
                  className="flex flex-wrap items-center gap-3"
                >
                  <dt className="text-muted-foreground w-20 shrink-0">
                    {link.term}
                  </dt>
                  <dd>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary inline-flex items-center gap-1.5 rounded font-medium break-all hover:underline"
                    >
                      <GitBranch
                        aria-hidden="true"
                        className="size-4 shrink-0"
                      />
                      {REPOSITORY_LABEL}
                      <span className="text-muted-foreground whitespace-nowrap">
                        {link.branch}
                      </span>
                      <span className="sr-only"> (새 창에서 열림)</span>
                    </a>
                  </dd>
                </div>
              ))}
              <div className="flex flex-wrap items-center gap-3">
                <dt className="text-muted-foreground w-20 shrink-0">작업자</dt>
                <dd>{AUTHOR}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <History
                aria-hidden="true"
                className="text-primary size-5 shrink-0"
              />
              버전 업데이트
            </CardTitle>
          </CardHeader>
          <CardContent>
            {releaseNotes.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                아직 릴리스가 없습니다. RELEASE_NOTES_DRAFT.md 에 작성하면 main
                릴리스 때 여기에 쌓입니다.
              </p>
            ) : (
              <div className="max-h-100 overflow-auto overscroll-contain">
                <div className="flex flex-col gap-6">
                  {releaseNotes.map((note, noteIndex) => (
                    <section
                      key={note.version}
                      className={cn(
                        "flex flex-col gap-3 rounded-md",
                        noteIndex === 0 && `${LATEST_HIGHLIGHT} p-3`,
                      )}
                    >
                      <div className="bg-card sticky top-0 flex flex-wrap items-center gap-2 py-1">
                        <Badge variant="outline">{note.version}</Badge>
                        <span className="text-muted-foreground text-sm">
                          {formatReleaseDate(note.releasedAt)}
                        </span>
                      </div>
                      {note.changes.some(
                        (change) => !isHandoffChange(change),
                      ) && (
                        <ul className="flex flex-col gap-1 text-sm">
                          {note.changes
                            .filter((change) => !isHandoffChange(change))
                            .map((change) => (
                              <li key={String(change)} className="break-keep">
                                {String(change)}
                              </li>
                            ))}
                        </ul>
                      )}
                      {note.changes.some(isHandoffChange) && (
                        <div className="flex flex-col gap-3">
                          {note.changes
                            .filter(isHandoffChange)
                            .map((change) => (
                              <ReleaseNoteHandoffCard
                                key={`${change.mode}-${change.title}`}
                                change={change}
                              />
                            ))}
                        </div>
                      )}
                    </section>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PackageCheck
                aria-hidden="true"
                className="text-primary size-5 shrink-0"
              />
              프론트엔드 인계 자산
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-muted-foreground text-sm break-keep">
              frontend-handoff 브랜치로 전달되는 범위입니다. CI 설정과 작업
              문서는 전달하지 않습니다.
            </p>
            <div className="border-border overflow-hidden rounded-md border">
              <div className="max-h-100 overflow-auto overscroll-contain [&>div]:overflow-visible">
                <Table>
                  <TableHeader className="[&_th]:bg-muted [&_th]:sticky [&_th]:top-0">
                    <TableRow>
                      <TableHead className="min-w-[5rem]">구분</TableHead>
                      <TableHead className="min-w-[11rem]">원본 경로</TableHead>
                      <TableHead className="min-w-[16rem]">역할</TableHead>
                      <TableHead className="min-w-[7rem]">반영 버전</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {handoffAssets.map((asset) => {
                      const assetVersion = findAssetVersion(asset.path)

                      return (
                        <TableRow
                          key={asset.path}
                          className={cn(
                            assetVersion.isCurrent && LATEST_HIGHLIGHT,
                          )}
                        >
                          <TableCell className="text-muted-foreground align-top text-sm">
                            <span className="flex items-center gap-1.5">
                              {asset.kind === "폴더" ? (
                                <Folder
                                  aria-hidden="true"
                                  className="text-primary size-4 shrink-0"
                                />
                              ) : (
                                <FileText
                                  aria-hidden="true"
                                  className="size-4 shrink-0"
                                />
                              )}
                              {asset.kind}
                            </span>
                          </TableCell>
                          <TableCell className="align-top font-mono text-sm">
                            {asset.path}
                          </TableCell>
                          <TableCell className="align-top text-sm break-keep">
                            {asset.role}
                          </TableCell>
                          <TableCell className="align-top">
                            <Badge
                              variant={
                                assetVersion.isCurrent ? "default" : "outline"
                              }
                            >
                              {assetVersion.version}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-muted-foreground text-sm">
          총{" "}
          <span className="text-foreground font-medium">{IA_ROWS.length}</span>
          개 화면
        </p>

        <Table className="border-border border-t">
          <TableHeader>
            <TableRow className="bg-muted/25">
              {DEPTH_HEADS.map((head) => (
                <TableHead
                  key={head}
                  className="border-border min-w-[9rem] border-r"
                >
                  {head}
                </TableHead>
              ))}
              <TableHead className="border-border min-w-[7rem] border-r">
                화면 Type
              </TableHead>
              <TableHead className="border-border min-w-[5rem] border-r">
                UIUX
              </TableHead>
              <TableHead className="min-w-[6rem]">버전</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {IA_ROWS.map((row) => {
              const isTopLevel = row.cells[0]?.level === 1

              return (
                <TableRow
                  key={row.no}
                  className={cn(
                    isTopLevel && "bg-muted/40",
                    isLatestScreen(row.version) && LATEST_HIGHLIGHT,
                  )}
                >
                  {row.cells.map((cell, index) =>
                    cell.level === 0 ? (
                      <TableCell
                        key={row.no + "-none-" + index}
                        colSpan={cell.colSpan}
                        className="border-border text-muted-foreground border-r align-top"
                      >
                        -
                      </TableCell>
                    ) : (
                      <th
                        key={row.no + "-" + cell.level}
                        scope="row"
                        rowSpan={cell.rowSpan}
                        colSpan={cell.colSpan}
                        className="border-border border-r border-b p-2 text-left align-top font-normal"
                      >
                        <span className="flex flex-col gap-1">
                          <Badge variant="outline" className="w-fit">
                            {cell.level}
                          </Badge>
                          <span className="text-sm font-medium break-keep">
                            {cell.name}
                          </span>
                        </span>
                      </th>
                    ),
                  )}

                  <TableCell className="border-border border-r align-top text-sm">
                    {row.type}
                  </TableCell>
                  <TableCell className="border-border border-r align-top">
                    <Badge variant={getUiuxVariant(row.uiux)}>{row.uiux}</Badge>
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge variant="outline">{row.version}</Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default PublishingIndexPage
