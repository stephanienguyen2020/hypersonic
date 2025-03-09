"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import { AppLayout } from "@/app/components/app-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  ArrowUpDown,
  ChevronDown,
  Copy,
  ExternalLink,
  Eye,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Share2,
  Trash,
  TrendingUp,
  TrendingDown,
  Rocket,
  Users,
  DollarSign,
  LinkIcon,
  Settings,
  Wallet,
  Clock,
  MessageCircle,
  Hash,
  ImageIcon,
  Save,
} from "lucide-react";
import Link from "next/link";
import { useTokenStore } from "@/app/store/tokenStore";
import { useTestTokenService } from "@/services/TestTokenService";
import {
  getTokens,
  getPriceForTokens,
  getPurchasedTokens,
  getTokenBalance,
} from "@/services/memecoin-launchpad";
import { useRouter } from "next/navigation";
import { useWallet } from "@/app/providers/WalletProvider";
import { toast } from "@/components/ui/use-toast";
import { useAccount, useWalletClient } from "wagmi";
import { AutoShillSettings } from "@/app/components/auto-shill-settings";

export default function TokensPage() {
  // All hooks at the top level
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [tokenTypeTab, setTokenTypeTab] = useState("created");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "value", direction: "desc" });
  const [isLoading, setIsLoading] = useState(true);
  const [createdTokens, setCreatedTokens] = useState<any[]>([]);
  const [purchasedTokens, setPurchasedTokens] = useState<any[]>([]);
  const [showConnectPrompt, setShowConnectPrompt] = useState(false);

  const testTokenService = useTestTokenService();
  const router = useRouter();
  const { networkName, isMetaMaskInstalled, connect } = useWallet();
  const { isConnected } = useAccount();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const dataFetched = useRef(false);
  const { data: walletClient } = useWalletClient();

  // Handle connect wallet
  const handleConnectWallet = useCallback(async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Error",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  }, [connect]);

  // Update wallet connection status and trigger fetch
  useEffect(() => {
    const isConnected = !!walletClient;
    setIsWalletConnected(isConnected);

    if (isConnected) {
      // Reset dataFetched when wallet connects
      dataFetched.current = false;
      handleRefresh();
    }
  }, [walletClient]);

  // Manual refresh function
  const handleRefresh = useCallback(() => {
    dataFetched.current = false;
    setIsLoading(true);
  }, []);

  // Fetch tokens effect
  useEffect(() => {
    if (!isWalletConnected || dataFetched.current) return;

    async function fetchAllTokens() {
      try {
        setIsLoading(true);
        dataFetched.current = true;

        const [createdTokensData, purchasedTokensData] = await Promise.all([
          testTokenService.testGetTokens({ isCreator: true }).catch((error) => {
            console.error("Error fetching created tokens:", error);
            return [];
          }),
          testTokenService.testGetPurchasedTokens().catch((error) => {
            console.error("Error fetching purchased tokens:", error);
            return [];
          }),
        ]);

        // Process created tokens
        const processedCreatedTokens = await Promise.all(
          (createdTokensData || []).map(async (token) => {
            try {
              let tokenPrice = "0";
              if (token.isOpen) {
                try {
                  const tokenSaleData = {
                    token: token.token,
                    name: token.name || "Unknown Token",
                    creator: token.creator,
                    sold: token.sold || "0",
                    raised: token.raised || "0",
                    isOpen: token.isOpen,
                    metadataURI: token.image || "",
                  };

                  const price = await testTokenService
                    .testGetPriceForTokens(tokenSaleData, BigInt(1))
                    .catch(() => BigInt(0));
                  tokenPrice = ethers.formatEther(price);
                } catch (error) {
                  console.error(
                    `Error fetching price for token ${token.name}:`,
                    error
                  );
                }
              }

              return {
                id: token.token,
                token: token.token,
                name: token.name || "Unknown Token",
                symbol: (token.name || "UNKN").substring(0, 4).toUpperCase(),
                description: token.description || "No description available",
                imageUrl: token.image || "/placeholder.svg",
                price: tokenPrice,
                marketCap:
                  (Number(token.raised || "0") / 1e18).toFixed(2) + "k",
                priceChange: 5.0,
                fundingRaised: token.raised?.toString() || "0",
                chain: "Electroneum",
                volume24h: "$100,000.00",
                holders: "1000",
                launchDate: "2023-01-01",
                status: token.isOpen ? "active" : "locked",
                creator: token.creator,
                type: "created",
              };
            } catch (error) {
              console.error("Error processing created token:", error);
              return null;
            }
          })
        );

        // Process purchased tokens
        const processedPurchasedTokens = await Promise.all(
          (purchasedTokensData || []).map(async (token) => {
            try {
              let tokenPrice = "0";
              if (token.isOpen) {
                try {
                  const tokenSaleData = {
                    token: token.token,
                    name: token.name || "Unknown Token",
                    creator: token.creator,
                    sold: token.sold || "0",
                    raised: token.raised || "0",
                    isOpen: token.isOpen,
                    metadataURI: token.image || "",
                  };

                  const price = await testTokenService
                    .testGetPriceForTokens(tokenSaleData, BigInt(1))
                    .catch(() => BigInt(0));
                  tokenPrice = ethers.formatEther(price);
                } catch (error) {
                  console.error(
                    `Error fetching price for token ${token.name}:`,
                    error
                  );
                }
              }

              return {
                id: token.token,
                token: token.token,
                name: token.name || "Unknown Token",
                symbol: (token.name || "UNKN").substring(0, 4).toUpperCase(),
                description: token.description || "No description available",
                imageUrl: token.image || "/placeholder.svg",
                price: tokenPrice,
                marketCap:
                  (Number(token.raised || "0") / 1e18).toFixed(2) + "k",
                priceChange: 5.0,
                fundingRaised: token.raised?.toString() || "0",
                chain: "Electroneum",
                volume24h: "$100,000.00",
                holders: "1000",
                launchDate: "2023-01-01",
                status: token.isOpen ? "active" : "locked",
                balance: token.balance
                  ? ethers.formatEther(token.balance)
                  : "0",
                type: "purchased",
              };
            } catch (error) {
              console.error("Error processing purchased token:", error);
              return null;
            }
          })
        );

        // Update state with filtered results
        setCreatedTokens(processedCreatedTokens.filter(Boolean));
        setPurchasedTokens(processedPurchasedTokens.filter(Boolean));
      } catch (error) {
        console.error("Error fetching tokens:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to load tokens.",
          variant: "destructive",
        });
        // Reset data fetched flag on error to allow retrying
        dataFetched.current = false;
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllTokens();
  }, [isWalletConnected, testTokenService]);

  // Memoized values
  const tokens = useMemo(() => {
    return tokenTypeTab === "created" ? createdTokens : purchasedTokens;
  }, [tokenTypeTab, createdTokens, purchasedTokens]);

  const filteredTokens = useMemo(() => {
    return tokens.filter((token) => {
      const matchesSearch =
        token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase());

      if (activeTab === "all") return matchesSearch;
      if (activeTab === "active")
        return matchesSearch && token.status === "active";
      if (activeTab === "locked")
        return matchesSearch && token.status === "locked";

      return matchesSearch;
    });
  }, [tokens, searchQuery, activeTab]);

  const sortedTokens = useMemo(() => {
    return [...filteredTokens].sort((a, b) => {
      if (
        a[sortConfig.key as keyof typeof a] <
        b[sortConfig.key as keyof typeof b]
      ) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (
        a[sortConfig.key as keyof typeof a] >
        b[sortConfig.key as keyof typeof b]
      ) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredTokens, sortConfig]);

  // Find best and worst performers
  const bestPerformer =
    tokens.length > 0
      ? [...tokens].reduce(
          (best, token) =>
            token.priceChange > best.priceChange ? token : best,
          tokens[0]
        )
      : null;

  const worstPerformer =
    tokens.length > 0
      ? [...tokens].reduce(
          (worst, token) =>
            token.priceChange < worst.priceChange ? token : worst,
          tokens[0]
        )
      : null;

  // Calculate total volume
  const totalVolume = tokens.reduce((sum, token) => {
    const volumeNumber = parseFloat(token.volume24h.replace(/[^0-9.]/g, ""));
    return sum + volumeNumber;
  }, 0);

  // Get chain from wallet if available, otherwise use Electroneum as fallback
  const getChainFromWallet = () => {
    if (networkName && networkName.includes("Electroneum")) {
      return "Electroneum";
    }
    return "Electroneum"; // Fallback to Electroneum
  };

  // Render functions
  const renderMetaMaskPrompt = () => (
    <AppLayout>
      <div className="container py-8">
        <Card className="border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wallet className="h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Wallet Not Available</h2>
            <p className="text-muted-foreground mb-6">
              Please install MetaMask to view your tokens
            </p>
            <Button
              onClick={() =>
                window.open("https://metamask.io/download/", "_blank")
              }
            >
              Install MetaMask
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );

  const renderConnectPrompt = () => (
    <AppLayout>
      <div className="container py-8">
        <Card className="border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wallet className="h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">
              Please connect your wallet to view your tokens
            </p>
            <Button onClick={handleConnectWallet}>Connect Wallet</Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );

  // Early returns using memoized conditions
  if (!isMetaMaskInstalled) {
    return renderMetaMaskPrompt();
  }

  if (showConnectPrompt) {
    return renderConnectPrompt();
  }

  return (
    <AppLayout>
      <div className="min-h-screen pt-12">
        {/* Header section */}
        <div className="relative mb-12 pb-6 border-b border-white/10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                My{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-[#00ff00] to-emerald-400">
                  Tokens
                </span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage and monitor your token portfolio
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Create Token button removed */}
            </div>
          </div>
        </div>

        {/* Token Type Tabs */}
        <div className="mb-8">
          <Tabs
            value={tokenTypeTab}
            onValueChange={setTokenTypeTab}
            className="w-full"
          >
            <TabsList className="bg-white/5 p-1 rounded-lg grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger
                value="created"
                className="data-[state=active]:bg-black/50 flex items-center gap-2"
              >
                <Rocket className="w-4 h-4" />
                Created Tokens
              </TabsTrigger>
              <TabsTrigger
                value="purchased"
                className="data-[state=active]:bg-black/50 flex items-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                Purchased Tokens
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
          <Card className="bg-white/5 border-white/10 hover:border-green-500/50 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Rocket className="w-5 h-5 text-green-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Tokens</p>
                <p className="text-2xl font-bold">{tokens.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 hover:border-green-500/50 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Holders</p>
                <p className="text-2xl font-bold">1,234</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 hover:border-green-500/50 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">$123,456</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 hover:border-green-500/50 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">24h Change</p>
                <p className="text-2xl font-bold text-green-400">+5.67%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/5 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center mb-6">
            <Tabs
              defaultValue="all"
              className="w-full md:w-auto"
              onValueChange={setActiveTab}
            >
              <TabsList className="bg-black/20 p-1">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-black/50"
                >
                  All Tokens
                </TabsTrigger>
                <TabsTrigger
                  value="active"
                  className="data-[state=active]:bg-black/50"
                >
                  Active
                </TabsTrigger>
                <TabsTrigger
                  value="locked"
                  className="data-[state=active]:bg-black/50"
                >
                  Locked
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex w-full md:w-auto gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tokens..."
                  className="pl-10 bg-black/20 border-white/10 focus:border-green-500/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Token Table */}
          <div className="rounded-lg overflow-hidden border border-white/10">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-white/10 bg-black/20">
                  <TableHead>Token</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Market Cap</TableHead>
                  <TableHead>Holders</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTokens.map((token) => (
                  <TableRow
                    key={token.id}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={token.imageUrl}
                          alt={token.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-medium">{token.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {token.symbol}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{token.price}</TableCell>
                    <TableCell>{token.marketCap}</TableCell>
                    <TableCell>{token.holders}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          token.status === "active" ? "default" : "secondary"
                        }
                        className={
                          token.status === "active"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-gray-500/20 text-gray-400"
                        }
                      >
                        {token.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem>
                                <Rocket className="w-4 h-4 mr-2" />
                                Auto Shill
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Auto Shill Settings</DialogTitle>
                                <DialogDescription>
                                  Configure your token's auto shill settings
                                </DialogDescription>
                              </DialogHeader>
                              <AutoShillSettings />
                            </DialogContent>
                          </Dialog>
                          <DropdownMenuItem>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">
                            <Trash className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
