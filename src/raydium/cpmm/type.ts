import { EpochInfo, PublicKey } from "@solana/web3.js";
import { ApiCpmmConfigInfo, ApiV3PoolInfoStandardItemCpmm, ApiV3Token, CpmmKeys } from "@/api/type";
import { TxVersion } from "@/common/txTool/txType";
import BN from "bn.js";
import { ComputeBudgetConfig, GetTransferAmountFee } from "@/raydium/type";
import { SwapResult } from "./curve/calculator";
import { Percent } from "@/module";
import { CpmmPoolInfoLayout } from "./layout";
import Decimal from "decimal.js";

export interface CpmmConfigInfoInterface {
  bump: number;
  disableCreatePool: boolean;
  index: number;
  tradeFeeRate: BN;
  protocolFeeRate: BN;
  fundFeeRate: BN;
  createPoolFee: BN;

  protocolOwner: PublicKey;
  fundOwner: PublicKey;
}

export interface CpmmPoolInfoInterface {
  configId: PublicKey;
  poolCreator: PublicKey;
  vaultA: PublicKey;
  vaultB: PublicKey;

  mintLp: PublicKey;
  mintA: PublicKey;
  mintB: PublicKey;

  mintProgramA: PublicKey;
  mintProgramB: PublicKey;

  observationId: PublicKey;

  bump: number;
  status: number;

  lpDecimals: number;
  mintDecimalA: number;
  mintDecimalB: number;

  lpAmount: BN;
  protocolFeesMintA: BN;
  protocolFeesMintB: BN;
  fundFeesMintA: BN;
  fundFeesMintB: BN;
  openTime: BN;
}

export interface CreateCpmmPoolParam<T> {
  programId: PublicKey;
  poolFeeAccount: PublicKey;
  mintA: Pick<ApiV3Token, "address" | "decimals" | "programId">;
  mintB: Pick<ApiV3Token, "address" | "decimals" | "programId">;
  mintAAmount: BN;
  mintBAmount: BN;
  startTime: BN;
  feeConfig: ApiCpmmConfigInfo;

  associatedOnly: boolean;
  checkCreateATAOwner?: boolean;

  ownerInfo: {
    feePayer?: PublicKey;
    useSOLBalance?: boolean; // if has WSOL mint
  };
  computeBudgetConfig?: ComputeBudgetConfig;
  txVersion?: T;
}

export interface CreateCpmmPoolAddress {
  poolId: PublicKey;
  configId: PublicKey;
  authority: PublicKey;
  lpMint: PublicKey;
  vaultA: PublicKey;
  vaultB: PublicKey;
  observationId: PublicKey;
  mintA: ApiV3Token;
  mintB: ApiV3Token;
  programId: PublicKey;
  poolFeeAccount: PublicKey;
  feeConfig: ApiCpmmConfigInfo;
}

export interface AddCpmmLiquidityParams<T = TxVersion.LEGACY> {
  poolInfo: ApiV3PoolInfoStandardItemCpmm;
  poolKeys?: CpmmKeys;
  payer?: PublicKey;
  inputAmount: BN;
  baseIn: boolean;
  slippage: Percent;
  config?: {
    bypassAssociatedCheck?: boolean;
    checkCreateATAOwner?: boolean;
  };
  computeBudgetConfig?: ComputeBudgetConfig;
  txVersion?: T;
  computeResult?: {
    inputAmountFee: GetTransferAmountFee;
    anotherAmount: GetTransferAmountFee;
    maxAnotherAmount: GetTransferAmountFee;
    liquidity: BN;
  };
}

export interface WithdrawCpmmLiquidityParams<T = TxVersion.LEGACY> {
  poolInfo: ApiV3PoolInfoStandardItemCpmm;
  poolKeys?: CpmmKeys;
  payer?: PublicKey;
  lpAmount: BN;
  slippage: Percent;
  computeBudgetConfig?: ComputeBudgetConfig;
  txVersion?: T;
}

export interface CpmmSwapParams<T = TxVersion.LEGACY> {
  poolInfo: ApiV3PoolInfoStandardItemCpmm;
  poolKeys?: CpmmKeys;
  payer?: PublicKey;
  baseIn: boolean;
  slippage?: number;
  swapResult: SwapResult;
  inputAmount: BN;

  config?: {
    bypassAssociatedCheck?: boolean;
    checkCreateATAOwner?: boolean;
    associatedOnly?: boolean;
  };
  computeBudgetConfig?: ComputeBudgetConfig;
  txVersion?: T;
}

export interface ComputePairAmountParams {
  poolInfo: ApiV3PoolInfoStandardItemCpmm;
  baseReserve: BN;
  quoteReserve: BN;
  amount: string | Decimal;
  slippage: Percent;
  epochInfo: EpochInfo;
  baseIn?: boolean;
}

export type CpmmRpcData = ReturnType<typeof CpmmPoolInfoLayout.decode> & {
  baseReserve: BN;
  quoteReserve: BN;
  vaultAAmount: BN;
  vaultBAmount: BN;
  configInfo?: CpmmConfigInfoInterface;
  poolPrice: Decimal;
  programId: PublicKey;
};

export type CpmmComputeData = {
  id: PublicKey;
  version: 7;
  configInfo: CpmmConfigInfoInterface;
  mintA: ApiV3Token;
  mintB: ApiV3Token;
  authority: PublicKey;
} & Omit<CpmmRpcData, "configInfo" | "mintA" | "mintB">;
